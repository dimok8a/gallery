const express = require('express');
const PORT = process.env.PORT || 5000
const app = express()
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index')
const Database = require("./Database/Database");
const cors = require('cors');

app.use(cors())
app.use(fileUpload({}))
app.use(express.json({ extended: true }))
app.use('/api', router)
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))


// На случай запуска прямо через консоль
if (process.env.NODE_ENV === undefined) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
const start = async () => {
    try
    {
        await new Database().init()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (err)
    {
        console.log(err)
    }
}

start()
// main().then(() => start())
