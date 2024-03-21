const Router = require('express')
const router = new Router()
const photoController = require('../controllers/photoController')

router.get("/:id", photoController.getById)
router.get("/", photoController.getAllPhotos)
router.post("/", photoController.create)


module.exports = router
