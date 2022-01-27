const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Genre } = require('../../../db');

const CreateFilm = async (req, res) => {
    try {

        await Genre.create({
            ...req.body,
            //image: req.file.path,
        });

        return res.status(200).send({ message: "Género creado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateFilm;