const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Genre, Film, Character } = require('../../../db');
const moment = require("moment");
const fs = require('fs-extra');
const cloudinary = require('cloudinary');

const schema = yup.object().shape({
    title: yup.string().required(),
    image: yup.mixed(),
    year: yup.number().required(),
    rating: yup.number().required(),
    //se asume que del lado del front-end el género se seleccionaría con un combobox por eso recibe un number
    genreId: yup.number(),
    //para variar se creará por nombre del personaje y no por el id
    characters: yup.array(
        yup.object({
            name: yup.string()
        })
    ).nullable()
});

const CreateFilm = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

       //Se asume que puede haber películas con el mismo nombre

        const genre = await Genre.findOne({
            where: {
                id: request.data.genreId
            }
        });
        if (!genre) return new ErrorModel().newBadRequest(`El género no existe en el sistema`).send(res);

        let characters = [];
        console.log(request.data)
        console.log(request.data.characters)
        if(request.data.characters == null) {
            console.log("es nulo")
        } else {
            console.log("no es nulo")
        }
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

        const result = await cloudinary.v2.uploader.upload(req.file.path);
        
        const film = await Film.create({
            ...req.body,
            createdAt: moment.now(),
            imageURL: result.url,
            imagePublicId: result.public_id
        });

        await fs.unlink(req.file.path);

        if (request.data.characters != null) {
            for (const c of characters) {
                await film.addCharacter(c.id);
            }
        }


        return res.status(200).send({ message: "Película creada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateFilm;