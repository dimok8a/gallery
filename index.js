const express = require('express');
const PORT = process.env.PORT || 5000
const app = express()
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index')


app.use('/api', router)
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

// На случай запуска прямо через консоль
if (process.env.NODE_ENV === undefined) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
// New comment 1
const start = async () => {
    try
    {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (err)
    {
        console.log(err)
    }
}

start()
