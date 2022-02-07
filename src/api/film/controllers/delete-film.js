const ErrorModel = require('../../../models/api-error');
const { Character, Film, CharactersFilms} = require('../../../db');
const cloudinary = require('cloudinary');

const DeleteFilm = async (req, res) => {
    try {
        const film = await Film.findOne({
            where: {
                id: req.params.id
            },
            include: [Character]
        });
        if (!film) return new ErrorModel().newNotFound(`La película o serie que se intenta eliminar no existe en el sistema`).send(res);

        await cloudinary.v2.uploader.destroy(film.imagePublicId);

        for (const c of film.dataValues.characters) {
            const association = await CharactersFilms.findOne({
                where: {
                    characterId: c.dataValues.id,
                    filmId: req.params.id
                }
            })
            association.destroy();
        }

        film.destroy();

        return res.status(200).send({ message: "Película o serie eliminada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = DeleteFilm;