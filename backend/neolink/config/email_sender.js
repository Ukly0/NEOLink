const nodemailer = require("nodemailer");
module.exports = {
    async send_mail(email, random_string){
        try{
            const transporter = nodemailer.createTransport({
                host: process.env.HOST_MAIL,
                port: 587,
                secure: false,
                auth:{
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL,
                },
            });

            await transporter.sendMail({
                from: process.env.USER_MAIL,
                to: email,
                subject: 'NEOLAiA Researchers survey: code to be used to fill the form',
                text: `Your OTP password to fill the form is: ${random_string} \n
                The password expires in 1 hour.`,
            });
            console.log('email sent sucessfully');
        } catch (error){
            console.log(error)
            console.log('email not sent')
        }
    }
}