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
        
        let characters = []
        for (const f of film.characters) {
            const character = await Character.findOne({
                where: {
                    id: f.id
                }
            })
            characters.push(character.name);
        }

        //se optó por mostrar nombre del género y de los personajes
        const response = {
            ...film.dataValues,
            characters,
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