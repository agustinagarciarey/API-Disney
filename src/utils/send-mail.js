const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function SendMail(to, subject, name) {

    const msg = {
            to, 
            from: process.env.SENDGRID_EMAIL,
            subject,
            template_id : process.env.SENDGRID_WELCOME_TEMPLATE_ID,
            dynamic_template_data : {
                user : name
            }
    }
    try {
        await sgMail.send(msg);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = SendMail;