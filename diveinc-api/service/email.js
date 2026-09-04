'use strict';

const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

let key = { admin_diveinc: process.env.ADMIN_EMAIL || "admin@localhost" }
try {
  key = require(`@root/email.json`)
} catch (err) {
  if (err.code !== "MODULE_NOT_FOUND") throw err
}

module.exports = (message) => {

  //MAILTRAP
  // const mailConfig = {
  //      host: 'smtp.mailtrap.io',
  //      port: 2525,
  //      auth: {
  //        user: process.env.MAILTRAP_USER,
  //        pass: process.env.MAILTRAP_PASS
  //      }
  // }

  //G-SUITES
  // const mailConfig = {
  //      host: 'smtp.gmail.com',
  //      port: 465,
  //      secure: true,
  //      auth: {
  //        type: 'OAuth2',
  //        user: 'no-reply@hara.co.id',
  //        serviceClient : key.client_id,
  //        privateKey : key.private_key
  //      }
  // }
  //
  // let transporter = nodemailer.createTransport(
  //   mailConfig
  // );
  //
  // transporter.sendMail(message, (error, info) => {
  //   if (error) {
  //     console.log('Error occurred');
  //     console.log(error.message);
  //   } else {
  //     console.log('Message sent successfully!');
  //     console.log(info.messageId);
  //   }
  // });

    const transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('Error occurred');
        console.log(error);
      } else {
        console.log('Message sent successfully!');
        console.log(info);
      }
    });

}
