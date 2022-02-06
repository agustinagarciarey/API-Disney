const ErrorModel = require('../../../models/api-error');
const { Film, Character } = require('../../../db');
const moment = require('moment');

const GetCharacter = async (req, res) => {
    try {

        const character = await Character.findOne({
            where: {
                id: req.params.id
            },
            include: [Film]
        });
        if (!character) return new ErrorModel().newNotFound(`El personaje no existe en el sistema`).send(res);


        let films = []
        for (const f of character.films) {
            const film = await Film.findOne({
                where: {
                    id: f.id
                }
            })
            films.push(film.title);
        }

        //se optó por mostrar solo los nombres de las series o películas 
        const response = {
            ...character.dataValues,
            films,
            createdAt: moment(character.createdAt).format('DD/MM/YYYY'),
            updatedAt: moment(character.createdAt).format('DD/MM/YYYY')
        }

        return res.status(200).send(response);
    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = GetCharacter;