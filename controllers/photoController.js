const path = require('path')
const Database = require("../Database/Database")
const Photo = require("../Entity/Photo");
class PhotoController {

    constructor() {
        const db = new Database().getInstance()
    }

    async getBySmallFilePath(req, res)
    {
        try {
            const {smallFilePath} = req.query;
            const db = new Database().getInstance()
            const photo = await db.getPhotoBySmallFilePath(smallFilePath)
            return res.json(photo)
        } catch (e)
        {
            console.log(e)
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Something went wrong`})
        }
    }

    async getDetailsByFilePath(req, res)
    {
        try {
            const {filePath} = req.query;
            const db = new Database().getInstance()
            const photo = await db.getDetailsByFilePath(filePath)
            return res.json(photo)
        } catch (e)
        {
            console.log(e)
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Something went wrong`})
        }
    }

    async getAllPhotos(req, res)
    {
        try {
            const db = new Database().getInstance()
            const photos = await db.getAllPhotos()
            return res.json({photos})
        } catch (e) {
            console.log(e)
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Something went wrong`})
        }
    }

    async deletePhoto(req, res)
    {
        try {
            const {filePath} = req.query
            console.log(filePath)
            const db = new Database().getInstance()
            const photos = await db.deletePhoto(filePath)
            return res.json({message: `Photo was deleted!`})
        } catch (e) {
            console.log(e)
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Something went wrong`})
        }
    }

    async create(req, res, next)
    {
        const db = new Database().getInstance()
        try {
            const {name, file_size, width, height, date} = req.body
            const {file} = req.files
            const photo = new Photo(name, new Date(date), file_size, height, width)
            await db.addNewPhoto(photo, file)
            return res.json({message: `Photo was created!`})
        } catch (e) {
            console.log(e)
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Photo was not created!`})
        }


    }
}

module.exports = new PhotoController()
