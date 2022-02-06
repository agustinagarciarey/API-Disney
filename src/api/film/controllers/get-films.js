const ErrorModel = require('../../../models/api-error');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const { Film } = require('../../../db');
const Sequelize = require('sequelize');
const moment = require('moment');

const schema = yup.object().shape({
    name: yup.string(),
    order: yup.string().oneOf(["ASC", "DESC"]),
    genre: yup.string(),
})

const GetFilms = async (req, res) => {
    try {
        const request = await Validator(req.query, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const { name, order, genre } = request.data,
            orderBy = order ? order : "ASC",
            Op = Sequelize.Op;

        let films = [];
        //get by name
        if (name) {
            films = await Film.findAll({
                where: {
                    title: {
                        [Op.like]: `%${name}%`
                    }
                },
                order: [['createdAt', orderBy]]
            });
        }

        //get by genreId
        else if (genre) {
            films = await Film.findAll({
                where: {
                    genreId: genre
                },
                order: [['createdAt', orderBy]]
            });
        }

        //get by genre and name
        else if (genre && name) {
            films = await Film.findAll({
                where: {
                    genreId: genre,
                    title: {
                        [Op.like]: `%${name}%`
                    }
                },
                order: [['createdAt', orderBy]]
            });
        }
        //get all
        else {
            films = await Film.findAll({
                order: [['createdAt', orderBy]],
                attributes: ['title', 'imageURL', 'createdAt']
            });

            films = films.map(f => {
                f = {
                    ...f.dataValues,
                    createdAt: moment(f.createdAt).format('DD/MM/YYYY'),
                }
                return f;
            })
        }
        /*
        const response = films.map(f => {
            f = {
                ...f.dataValues,
                createdAt: moment(f.createdAt).format('DD/MM/YYYY'),
                updatedAt: moment(f.createdAt).format('DD/MM/YYYY')
            }
            return f;
        })
        */

        return res.status(200).send(films);

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = GetFilms;