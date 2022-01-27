const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Character } = require('../../../db');
const { Film } = require('../../../db');

const schema = yup.object().shape({
    name: yup.string().required(),
    image: yup.mixed(),
    age: yup.number().required(),
    weight: yup.number().required(),
    history: yup.string(),
    films: yup.array(
        yup.object({
            title: yup.string()
        })
    ),

})

const CreateCharacter = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);


        console.log(request.data)
        const character_exsists = await Character.findOne({
            where: {
                name: request.data.name
            }
        });
        if (character_exsists) return new ErrorModel().newBadRequest("El personaje ya ha sido registrado anteriormente").send(res);


        let films = [];
        if (request.data.films) {
            for (const f of request.data.films) {

                console.log(f);

                const film_exsists = await Film.findOne({
                    where: {
                        title: f.title
                    }
                });
                if (!film_exsists) return new ErrorModel().newBadRequest(`La película ${f.title} no ha sido creada todavía. Cree primero la película para poder asociarla a este personaje`).send(res);
                films.add(f);
            }
            console.log("Las películas son: " + films)
        }


        console.log(req.body);
        delete req.body.films;
        console.log(req.body);

        const character = await Character.create({
            ...req.body,
            id : 1,
            image: req.file.path,
        });

        films.forEach(f => {
            character.addFilm(f)
        });

        return res.status(200).send({ message: "Personaje creado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateCharacter;