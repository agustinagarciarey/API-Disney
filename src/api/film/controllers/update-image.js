const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Film } = require('../../../db');
const moment = require("moment");
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

const schema = yup.object().shape({
    image: yup.mixed(),
});

const UpdateImage = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const film_exists = await Film.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!film_exists) return new ErrorModel().newNotFound(`La película o serie que se intenta modificar no existe en el sistema`).send(res);

        await cloudinary.v2.uploader.destroy(film_exists.imagePublicId);
        const result = await cloudinary.v2.uploader.upload(req.file.path);

        await Film.update({
            updatedAt: moment.now(),
            imageURL: result.url,
            imagePublicId: result.public_id
        }, {
            where: { id: req.params.id }
        });

        await fs.unlink(req.file.path);

        return res.status(200).send({ message: "Película modificada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = UpdateImage;