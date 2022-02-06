const ErrorModel = require('../../../models/api-error');
const { Film, Character, Genre } = require('../../../db');
const moment = require('moment');

const GetFilm = async (req, res) => {
    try {

        console.log(req.params.id)

        const film = await Film.findOne({
            where: {
                id: req.params.id
            },
            include: [Character]
        });
        if (!film) return new ErrorModel().newNotFound(`La película o serie no existe en el sistema`).send(res);


        const genre = await Genre.findOne({
            where: {
                id: film.genreId
            }
        });

        let characters = ["Anakin", "Chwbacca"]
        /*
        characters": [
    {
      "name": "string"
    }
  ],
        film.Characters.forEach(c => {
            const character = await Character.findeOne({
                where: {
                    id: c.id
                }
            })
            characters.push(character.name);
        })*/

        //como pide algo bien detallado se optó por mostrar nombre del género y de los personajes (en vez de sus id)
        //como así también la fecha de creación y modificación en formato  DD/MM/YYYY
        const response = {
            ...film.dataValues,
            characters: characters,
            genre: genre.name,
            createdAt: moment(film.createdAt).format('DD/MM/YYYY'),
            updatedAt: moment(film.createdAt).format('DD/MM/YYYY')
        }

        return res.status(200).send(response);
    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = GetFilm;