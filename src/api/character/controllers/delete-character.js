const ErrorModel = require('../../../models/api-error');
const { Character } = require('../../../db');
const fs = require('fs-extra');

const DeleteCharacter = async (req, res) => {
    try {

        const id = Number(req.query.id);
        if (Number.isNaN(id)) return new ErrorModel().newBadRequest("ID incorrecto").send(res);

        const character_exsists = await Character.findOne({
            where: {
                id
            }
        });
        if (!character_exsists) return new ErrorModel().newBadRequest("El personaje no existe").send(res);

        const character = await models.User.destroy({
            where: { id }
        })

        console.log(character);

        await Character.create({
            ...req.body,
            image: req.file.path,
            createdAt: moment.now(),
        });

        return res.status(200).send({ message: "Personaje creado con éxito" });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = DeleteCharacter;