const path = require('path')
class PhotoController {
    async getById(req, res)
    {
        const { id } = req.params;
        return res.json({message: `Photo with id ${id}`})
    }

    async getAllPhotos(req, res)
    {
        const photos = ["1.jpg", "2.jpg"]
        return res.json({photos})
    }

    async create(req, res, next)
    {
        try {
            const {photo} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // photo.mv(path.resolve(__dirname, '..', 'static', fileName))
            // const newPhoto = await Photo.create({"photo": fileName, placeId})
            return res.json({message: `Photo created!`})
        } catch (e) {
            // return res.json(ApiError.badRequest(e.message))
            return res.json({message: `Photo was not created!`})
        }


    }
}

module.exports = new PhotoController()
