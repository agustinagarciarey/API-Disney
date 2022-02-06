const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Character } = require('../../../db');
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

        const character_exists = await Character.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!character_exists) return new ErrorModel().newNotFound(`El personaje que se intenta modificar no existe en el sistema`).send(res);

        await cloudinary.v2.uploader.destroy(character_exists.imagePublicId);
        const result = await cloudinary.v2.uploader.upload(req.file.path);

        await Character.update({
            updatedAt: moment.now(),
            imageURL: result.url,
            imagePublicId: result.public_id
        }, {
            where: { id: req.params.id }
        });

        await fs.unlink(req.file.path);

        return res.status(200).send({ message: "Personaje modificado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = UpdateImage;