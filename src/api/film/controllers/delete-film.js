const ErrorModel = require('../../../models/api-error');
const { Character, Film } = require('../../../db');
const cloudinary = require('cloudinary');

const DeleteFilm = async (req, res) => {
    try {

        console.log(req.params.id);

        const film = await Film.findOne({
            where: {
                id: req.params.id
            },
            include: [Character]
        });
        if (!film) return new ErrorModel().newNotFound(`La película o serie que se intenta modificar no existe en el sistema`).send(res);

        await cloudinary.v2.uploader.destroy(film.imagePublicId);

        console.log(film);
        
        //delete the association
        //await Character.removeFilm(film);
        film.characters.forEach(c => {
            c.destroy();
        })

        //delete the film
        film.destroy();

        return res.status(200).send({ message: "Película eliminada con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = DeleteFilm;