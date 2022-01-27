const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Genre } = require('../../../db');
const { Film } = require('../../../db');
const { Character } = require('../../../db');

const schema = yup.object().shape({
    title: yup.string().required(),
    image: yup.mixed(),
    year: yup.number().required(),
    rating: yup.number().required(),
    genre: yup.string().oneOf(["Acción", "Ciencia ficción", "Musical", "Drama", "Comedia"]),
    characters: yup.array(
        yup.object({
            name: yup.string()
        })
    ),
})

const CreateFilm = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const film_exsists = await Film.findOne({
            where: {
                title: request.data.title
            }
        });
        if (film_exsists) return new ErrorModel().newBadRequest("La película ya ha sido registrada anteriormente").send(res);

        const genre = await Genre.findOne({
            where: {
                name: request.data.genre
            }
        });
        if (!Genre) return new ErrorModel().newBadRequest(`El género ${request.data.genre} no existe en el sistema`).send(res);

        let characters = [];
        for(const c of request.data.characters){
            const character = await Character.findOne({
                where: {
                    name: c.name
                }
            });
            if (!character) return new ErrorModel().newBadRequest(`El personaje ${c.name} no ha sido creado todavía. Cree primero el personaje para poder asociarlo a la película`).send(res);
            characters.push(character);
        }

        delete req.body.characters;

        const film = await Film.create({
            ...req.body,
            genre_id : genre.id
            //image: req.file.path,
        });

        
        for(const c of characters){
            await film.addCharacter(c.id);
        }

        return res.status(200).send({ message: "Película creada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateFilm;