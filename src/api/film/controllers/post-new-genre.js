//ruta utilizada por practicidad para crear los géneros rápidamente
const ErrorModel = require('../../../models/api-error');
const { Genre } = require('../../../db');

const CreateGenre = async (req, res) => {
    try {

        await Genre.create({
            ...req.body,
        });

        return res.status(200).send({ message: "Género creado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateGenre;