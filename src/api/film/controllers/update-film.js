const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Genre } = require('../../../db');
const { Film } = require('../../../db');
const { Character } = require('../../../db');
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

        console.log(request.data);

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

            delete req.body.characters;
        }

        const film = await Film.update({
            ...req.body,
            updatedAt: moment.now(),
        }, {
            where: {id: req.params.id}
        });

        console.log(film);
    //not found si no devuelve nada el update
        if (request.data.characters != null) {
            for (const c of characters) {
                await film.setCharacter(c.id);
            }
        }
        
        return res.status(200).send({ message: "Película modificada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = UpdateFilm;