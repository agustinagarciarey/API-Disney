const ErrorModel = require('../../../models/api-error');
const { Character, CharactersFilms } = require('../../../db');
const Sequelize = require('sequelize');

const GetCharacters = async (req, res) => {
    try {
        const { name, age, movies, weight} = req.query,
            Op = Sequelize.Op;

        let characters = [];
        //get by name
        if (name) {
            characters = await Character.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
            });
        }
        //get by age
        else if (age) {
            characters = await Character.findAll({
                where: {
                    age: age
                }
            });
        }
        //get by weight
        else if (weight) {
            characters = await Character.findAll({
                where: {
                    weight: weight
                }
            });
        }
        //get by movies
        else if (movies) {
            const charactersFilms = await CharactersFilms.findAll({
                where: {
                    filmId: movies
                }
            });

            charactersFilms.forEach(c => {
                characters.push(c.dataValues.characterId);
            })

            characters = await Character.findAll({
                where: {
                    id: characters
                }
            });
        }
        //get all
        else {
            characters = await Character.findAll({
                attributes: ['name', 'imageURL']
            });
        }

        return res.status(200).send(characters);

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = GetCharacters;