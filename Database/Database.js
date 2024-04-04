const {Driver, getCredentialsFromEnv, getLogger, Types, Column, TableDescription, TypedData, getSACredentialsFromJson,
    IamAuthService
} = require('ydb-sdk');
const Photo = require("../Entity/Photo");
const {resolve} = require("path");
let EasyYandexS3 = require('easy-yandex-s3').default;
const AWS = require('@aws-sdk/client-sqs');
const path = require("path");

// export AWS_ACCESS_KEY_ID="YCAJE1uIQjmVVytVSeVcJrVk5"
// export AWS_SECRET_ACCESS_KEY="YCPBfA2lUOxWPP03Nl5WFmt1inXQb0XU5KGN6Hrx"

module.exports =  class Database {

    getInstance() {
        if (Database.exists) {
            return Database.instance;
        }
    }


    async init() {
        this.logger = getLogger({level: 'debug'});
        const endpoint = 'grpcs://ydb.serverless.yandexcloud.net:2135';
        const database = '/ru-central1/b1gjvuvg2ksveg9vanfe/etnls5n3402d694eaukk';
        const saCredentials = getSACredentialsFromJson(path.join(__dirname, "..", "keys.json"));
        const authService = new IamAuthService(saCredentials);
        this.driver = new Driver({endpoint, database, authService});
        if (!await this.driver.ready(10000)) {
            this.logger.fatal(`Driver has not become ready in 10 seconds!`);
            process.exit(1);
        }
        // await this.createTable()
        this.s3 = new EasyYandexS3({
            auth: {
                accessKeyId: 'YCAJE1uIQjmVVytVSeVcJrVk5',
                secretAccessKey: 'YCPBfA2lUOxWPP03Nl5WFmt1inXQb0XU5KGN6Hrx',
            },
            Bucket: 'gallery-bucket', // например, "my-storage",
            debug: true, // Дебаг в консоли, потом можете удалить в релизе
        });
        const config = {
            "credentials": {
                "accessKeyId": "YCAJE1uIQjmVVytVSeVcJrVk5",
                "secretAccessKey": "YCPBfA2lUOxWPP03Nl5WFmt1inXQb0XU5KGN6Hrx",
            },
            "region": "ru-central1",
            "endpoint": "https://message-queue.api.cloud.yandex.net"
        }
        this.mq = new AWS.SQS(config);
        // this.mq.config.loadFromPath(path.resolve(__dirname, 'awsconfig.json'))

        // await this.createQueue()
        Database.exists = true;
        Database.instance = this;

    }

    async createQueue() {
        const params = {
            'QueueName': 'gallery-queue'
        }
        const result = await this.mq.createQueue(params)
        const queueUrl = result['QueueUrl'];
        console.log('Queue created, URL: ' + queueUrl);
        return queueUrl;
    }

    async sendMessage(queueUrl, filePath) {
        const params = {
            'QueueUrl': queueUrl,
            'MessageBody': filePath,
        }

        const result = await this.mq.sendMessage(params)
        console.log('Message sent, ID: ' + result['MessageId']);
    }



    async createTable() {
        await this.driver.tableClient.withSession(async (session) => {
            // executing requests in a specific session
            this.logger.info('Creating tables...');

            await session.createTable(
                'photos',
                new TableDescription()
                    .withColumn(new Column(
                        'name',
                        Types.UTF8,
                    ))
                    .withColumn(new Column(
                        'file_path',
                        Types.UTF8,
                    ))
                    .withColumn(new Column(
                        'created_at',
                        Types.DATE,
                    ))
                    .withColumn(new Column(
                        'small_file_path',
                        Types.optional(Types.UTF8),
                    ))
                    .withColumn(new Column(
                        'file_size',
                        Types.optional(Types.UINT64),
                    ))
                    .withColumn(new Column(
                        'height',
                        Types.optional(Types.UINT64),
                    ))
                    .withColumn(new Column(
                        'width',
                        Types.optional(Types.UINT64),
                    ))
                    .withPrimaryKey('file_path')
            );
        });
    }


    async deleteTable() {
        await this.driver.tableClient.withSession(async (session) => {
            // executing requests in a specific session
            await session.dropTable('photos');
        });
    }

    async getAllPhotos() {
        return await this.driver.tableClient.withSession(async (session) => {
            const query = `
            SELECT small_file_path,
                   name
            FROM photos;`;
            const {resultSets} = await session.executeQuery(query);

            const resultSet = resultSets[0]
            const resultJson = []
            for (let i = 0; i<resultSet.rows.length; i++)
            {
                const smallFilePath = (resultSet.rows[i].items[0].textValue === null ? "https://gallery-bucket.storage.yandexcloud.net/img_376288.png" : resultSet.rows[i].items[0].textValue)
                const name = resultSet.rows[i].items[1].textValue
                resultJson.push({smallFilePath, name})
            }
            return resultJson
        })

    }


    async addNewPhoto(photo, file){
        return await this.driver.tableClient.withSession(async (session) => {
            const dateString = photo.createdAt.getFullYear() + "-" + (photo.createdAt.getMonth() + 1) + "-" + photo.createdAt.getDay()
            const uploadedFileInfo = await this.s3.Upload(
                {
                    buffer: file.data
                }, "/original_photos/"
            )
            await this.sendMessage("https://message-queue.api.cloud.yandex.net/b1gjvuvg2ksveg9vanfe/dj600000001g8r2i02fl/gallery-queue", uploadedFileInfo.key)
            const photoKey = uploadedFileInfo.Location
            const query = `
                INSERT INTO photos
                (name, file_path, created_at, file_size, height, width) VALUES
                ("${photo.name}", "${photoKey}", Date("${dateString}"), ${photo.fileSize}, ${photo.height}, ${photo.width});
                `;
            await session.executeQuery(query);
        });


    }

    async deletePhotoByPathFromTable(filePath){
        return await this.driver.tableClient.withSession(async (session) => {
            const query = `
            DELETE FROM photos 
            WHERE file_path = "${filePath}";`
            console.log(query)
            await session.executeQuery(query);
        });

    }

    async deletePhoto(filePath) {
        return await this.driver.tableClient.withSession(async (session) => {
            const query = `
            SELECT file_path,
                   small_file_path
            FROM photos WHERE file_path = '${filePath}'`;
            const {resultSets} = await session.executeQuery(query);
            const resultSet = resultSets[0]
            const resultJson = []
            for (let i = 0; i<resultSet.rows.length; i++)
            {
                const filePath = (resultSet.rows[i].items[0].textValue)
                let small_file_path = resultSet.rows[i].items[1].textValue
                const filePathArr = filePath.split("/")
                let filePathToDelete = filePathArr[filePathArr.length-2] + "/" + filePathArr[filePathArr.length-1]
                await this.s3.Remove(
                    filePathToDelete
                )
                await this.s3.Remove(
                    small_file_path
                )
                resultJson.push(filePath)
            }

            for (let i = 0; i<resultJson.length; i++)
            {
                await this.deletePhotoByPathFromTable(resultJson[i])
            }

        });
    }

    async getPhotoBySmallFilePath(smallFilePath) {
        return await this.driver.tableClient.withSession(async (session) => {
            const query = `
            SELECT file_path
            FROM photos WHERE small_file_path = '${smallFilePath}'`;
            const {resultSets} = await session.executeQuery(query);
            const resultSet = resultSets[0]
            const filePath = resultSet.rows[0].items[0].textValue
            return filePath
        })
    }

    async getDetailsBySmallFilePath(smallFilePath) {
        return await this.driver.tableClient.withSession(async (session) => {
            const query = `
            SELECT name, created_at, file_size, height, width
            FROM photos WHERE small_file_path = '${smallFilePath}'`;
            const {resultSets} = await session.executeQuery(query);
            const resultSet = resultSets[0]
            const result = TypedData.createNativeObjects(resultSet)[0];
            return result
        })
    }
}
