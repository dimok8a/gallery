const Router = require('express')
const router = new Router()
const photoController = require('../controllers/photoController')

router.get("/", photoController.getAllPhotos)
router.get("/original", photoController.getBySmallFilePath)
router.get("/original/details", photoController.getDetailsBySmallFilePath)
router.post("/", photoController.create)
router.delete("/", photoController.deletePhoto)
module.exports = router
