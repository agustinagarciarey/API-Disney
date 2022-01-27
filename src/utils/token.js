const jwt = require('jwt-simple');
const moment = require('moment');
const ErrorModel = require('../models/api-error');

const ALGHORITM = "HS256";

const CreateToken = (user) => {
	const payload = {
		id: user.id,
		createdAt: moment().unix(),
		expiredAt: moment().add(30, 'minutes').unix()
	}
	return jwt.encode(payload, process.env.SECRET_TOKEN_USER_AUTH, ALGHORITM);
}

const CheckToken = (req, res, next) => {
    if (!req.headers.authorization) return new ErrorModel().newUnauthorized("No hay token en la cabecera").send(res);
    const token = req.headers.authorization.split(" ")[1];
    try {
        const payload = jwt.decode(token, process.env.SECRET_TOKEN_USER_AUTH, false, ALGHORITM);
        if (payload.exp <= moment().unix()) return new ErrorModel().newUnauthorized("El token ha expirado").send(res);
        res.locals.payload = payload;
        return next();
    } catch (err) {
        return new ErrorModel().newUnauthorized("Token incorrecto").send(res)
    }
}
module.exports = {
    CreateToken,
	CheckToken,
}