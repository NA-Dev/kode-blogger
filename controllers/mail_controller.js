'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host:  'smtp.gmail.com',
  port: 587,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS 
  }
});

module.exports = {
  sendVerificationEmail: function (email, username, token) {
    let mailOptions = {
      from: '"Kode Blogger" <kodeblogger@gmail.com>', 
      to: email, 
      subject: 'Kode Blogger - Account Verification', 
      text: `http://kode-blogger.herokuapp.com/verify/${username}/${token}`, 
      html: `<a href="http://kode-blogger.herokuapp.com/verify/${username}/${token}">Verify Now</a>` 
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
      text: `http://kode-blogger.herokuapp.com/reset/${username}/${token}`, 
      html: `<a href="http://kode-blogger.herokuapp.com/reset/${username}/${token}">Reset Now</a>`  
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return console.log(error);
      }
    });
  }
};