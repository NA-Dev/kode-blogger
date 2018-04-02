'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'bmqxrcqtw7lrycjl@ethereal.email',
      pass: '7eCkemrKshsz2hNm2f'
  }
});

module.exports = {
  sendVerificationEmail: function (email, username, token) {
    let mailOptions = {
      from: '"Kode Blogger" <kodeblogger@gmail.com>', 
      to: email, 
      subject: 'Kode Blogger - Account Verification', 
      text: `http://localhost:3000/verify/${username}/${token}`, 
      html: `<a href="http://localhost:3000/verify/${username}/${token}">Verify Now</a>` 
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  },

  sendResetPasswordEmail: function(email, username, token) {
    let mailOptions = {
      from: '"Kode Blogger" <kodeblogger@gmail.com>', 
      to: email, 
      subject: 'Kode Blogger - Reset Password', 
      text: `http://localhost:3000/reset/${username}/${token}`, 
      html: `<a href="http://localhost:3000/reset/${username}/${token}">Reset Now</a>`  
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  }
};