const ErrorModel = require('../../../models/api-error');
const { Hash } = require('../../../utils/hashing');
const yup = require('yup');
const Validator = require('../../../utils/validator');
const SendMail = require('../../../utils/send-mail');
const { PasswordReg } = require('../../../utils/reg-exp');
const { User } = require('../../../db');
const { CreateToken } = require('../../../utils/token');

const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    mail: yup.string().required().transform((dato) => dato.toLowerCase()),
    password: yup.string().matches(PasswordReg, { message: "La contraseña debe tener mínimo 8 caracteres y máximo 12. Debe contener al menos una mayúscula, una minúscula y un número" }).required(),
})

const CreateUser = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        const user_exsists = await User.findOne({
            where: {
                mail: request.data.mail
            }
        });
        if (user_exsists) return new ErrorModel().newBadRequest("La cuenta de correo electrónico ya está registrada").send(res);

        const hashed_password = await Hash(req.body.password);

        const user = await User.create({
            ...req.body,
            password: hashed_password
        });

        SendMail(user.mail, "Bienvenido a Disney", user.name).then(() => {
            const token = CreateToken(user.id);
            return res.status(200).send({ token: token });
        }).catch((err) => {
            return new ErrorModel(535,"Error en el envío de email", "Hubo problemas al intentar enviar el email de bienvenida").send(res);
        });
        
    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateUser;