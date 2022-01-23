const ErrorModel = require('../../../models/api-error');
const { Hash } = require('../../../utils/hashing');
const moment = require('moment');
const yup = require('yup');
const Validator = require('../../../utils/validator');
//const SendTemplate = require('../../../utils/sendMail');
const { PasswordReg } = require('../../../utils/reg-exp');
const { User } = require('../../../db');

const schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    mail: yup.string().email().required().transform((dato) => dato.toLowerCase()),
    password: yup.string().matches(PasswordReg, { message: "La contraseña debe tener mínimo 8 caracteres y máximo 12. Debe contener al menos una mayúscula, una minúscula y un número" }).required(),
})

const CreateUser = async (req, res) => {
    try {
        const request = await Validator(req.body, schema);
        if (request.err) return new ErrorModel().newBadRequest(request.data).send(res);

        console.log(request.data);

        const user_exsists = await User.findOne({
            where: {
                mail: request.data.mail
            }
        });
        if (user_exsists) return new ErrorModel().newBadRequest("El mail del usuario ingresado ya existe en el sistema").send(res);

        const hashed_password = await Hash(req.body.password);

        const user = await User.create({
            ...req.body,
            createdAt: moment.now(),
            password: hashed_password
        });
        /*
                const sending = await SendTemplate(user.mail, "Control Stock Super Mami - Bienvenida", "sendEmail", { principalInfo: "¡Bienvenido al equipo de Super Mami!", secondaryInfo: `Su legajo es ${user.id}. Su contraseña es ${request.data.password}` });
                if (sending.error) return new ErrorModel(535, sending.error, "Error en el envío de email").send(res);
        */
        //return res.status(200).send({ message: "Usuario cargado con éxito" });
        return res.status(200).send(user);


    } catch (err) {
        return new ErrorModel().newInternalServerError(err.message).send(res);
    }
};

module.exports = CreateUser;