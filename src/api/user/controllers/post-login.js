const { CreateToken } = require('../../../utils/token');
const ErrorModel = require('../../../models/api-error');
const { Verify } = require('../../../utils/hashing');
const yup = require("yup");
const  Validator  = require('../../../utils/validator');
const { PasswordReg } = require('../../../utils/reg-exp');
const { User } = require('../../../db');

const schema = yup.object().shape({
    mail: yup.string().email().required().transform((dato) => dato.toLowerCase()),
    password: yup.string().matches(PasswordReg).required()
});

const LoginUser = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const user = await User.findOne({
            where: {
                mail: request.data.mail
            }
        });

        if (!user) return new ErrorModel().newBadRequest("Email o contraseña incorrectos").send(res);

        const hashed_password = await Verify(req.body.password, user.password);
        if (!hashed_password) return new ErrorModel().newBadRequest("Email o contraseña incorrectos").send(res);

        const token = CreateToken(user.id);
        return res.status(200).send({ token: token });

    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = LoginUser;
