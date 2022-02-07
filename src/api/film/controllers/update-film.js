const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Genre, Film, Character } = require('../../../db');
const moment = require("moment");

const schema = yup.object().shape({
    title: yup.string().required(),
    year: yup.number().required(),
    rating: yup.number().required(),
    genreId: yup.number(),
    characters: yup.array(
        yup.object({
            name: yup.string()
        })
    ).nullable(),
});

const UpdateFilm = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const film = await Film.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!film) return new ErrorModel().newNotFound(`La película o serie no existe en el sistema`).send(res);

        const genre = await Genre.findOne({
            where: {
                id: request.data.genreId
            }
        });
        if (!genre) return new ErrorModel().newBadRequest(`El género ingresado no existe en el sistema`).send(res);

        let characters = [];
        if (request.data.characters != null) {
            for (const c of request.data.characters) {
                const character = await Character.findOne({
                    where: {
                        name: c.name
                    }
                });
                if (!character) return new ErrorModel().newBadRequest(`El personaje ${c.name} no ha sido creado todavía. Cree primero el personaje para poder asociarlo a la película`).send(res);
                characters.push(character);
            }
        }

        await film.set({
            ...req.body,
            updatedAt: moment.now(),
        });

        if (request.data.characters  != null) {
            for (const c of characters) {
                await film.addCharacter(c.id);
            }
        }

        await film.save();

        return res.status(200).send({ message: "Película modificada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = UpdateFilm;