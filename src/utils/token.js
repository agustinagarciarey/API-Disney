const jwt = require('jwt-simple');
const moment = require('moment');

const ALGHORITM = "HS256";

const createToken = (user) => {
	const payload = {
		id: user.id,
		createdAt: moment().unix(),
		expiredAt: moment().add(30, 'minutes').unix()
	}
	return jwt.encode(payload, process.env.SECRET_TOKEN_USER_AUTH, ALGHORITM);
}

const checkToken = (req, res, next) => {
	if(req.headers['user-token']) {
		return res.json({ error: 'Falta token en cabecera'});
	}
	const userToken = req.headers['user-token'];
	let payload = {};
	try {
		payload = jwt.decode(userToken, process.env.SECRET_TOKEN_USER_AUTH, false, ALGHORITM);
	} catch (err) {
		return res.json({ error: 'El token es incorrecto' });
	}
	if (payload.expiredAt < moment().unix()) {
		return res.json({ error: 'El token ha expirado' });
	}
}

module.exports = {
    createToken,
	checkToken,
}