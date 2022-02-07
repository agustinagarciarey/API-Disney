const ErrorModel = require('../../../models/api-error');
const { Character, Film, CharactersFilms } = require('../../../db');
const cloudinary = require('cloudinary');

const DeleteCharacter = async (req, res) => {

    try {
        const character = await Character.findOne({
            where: {
                id: req.params.id
            },
            include: [Film]
        });
        if (!character) return new ErrorModel().newNotFound(`El personaje que se intenta eliminar no existe en el sistema`).send(res);
        
        await cloudinary.v2.uploader.destroy(character.imagePublicId);

        for (const f of character.dataValues.films) {
            const association = await CharactersFilms.findOne({
                where: {
                    filmId: f.dataValues.id,
                    characterId: req.params.id
                }
            })
            association.destroy();
        }
        
        character.destroy();

        return res.status(200).send({ message: "Personaje eliminado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = DeleteCharacter;