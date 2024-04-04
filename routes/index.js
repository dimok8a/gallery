const Router = require('express')

const router = new Router()
const photoRouter = require("./photoRouter")


router.use('/photo', photoRouter)

module.exports = router
