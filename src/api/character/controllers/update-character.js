const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Film, Character} = require('../../../db');
const moment = require("moment");

const schema = yup.object().shape({
    name: yup.string().required(),
    age: yup.number().required(),
    weight: yup.number().required(),
    history: yup.string(),
    films: yup.array(
        yup.object({
            title: yup.string()
        })
    ).nullable(),
});

const UpdateFilm = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const character = await Character.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!character) return new ErrorModel().newNotFound(`El personaje no existe en el sistema`).send(res);

        let films = [];
        if (request.data.films != null) {
            for (const f of request.data.films) {
                const film = await Film.findOne({
                    where: {
                        title: f.title
                    }
                });
                if (!film) return new ErrorModel().newBadRequest(`La película o serie ${c.name} no ha sido creada todavía. Cree primero el personaje para poder asociarlo`).send(res);
                films.push(film);
            }
        }

        await character.set({
            ...req.body,
            updatedAt: moment.now(),
        });

        if (request.data.films  != null) {
            for (const f of films) {
                await character.addFilm(f.id);
            }
        }

        await character.save();

        return res.status(200).send({ message: "Personaje modificado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = UpdateFilm;