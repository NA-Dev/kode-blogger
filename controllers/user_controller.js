const express = require('express');
const mailer = require('./mail_controller');
const db = require('../models');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require('randomstring');

module.exports = (app, passport) => {
  app.get('/verify/:username/:token', (req, res) => {
    db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then( data => {
      if (data) {
        data.updateAttributes({verified: true});
        req.flash('loginMessage', '<p class="success-message text-center">Email verified. Please login.</p>');
        res.redirect('/');
      } else {
        req.flash('loginMessage', '<p class="error-message text-center">Invalid verification token. Please contact support.</p>');
        res.redirect('/');
      }
    });
  });
  
  app.get('/resetRequest', (req, res) => {
    res.render('home', {message: req.flash('resetMessage'), showResetForm: true});
  });
  
  app.post('/resetRequest', (req, res) => {
    db.users.findOne({where: {username: req.body.username}}).then(data => {
      if (data) {
        if (data.dataValues.verified) {
          let token = randomstring.generate(16);
          data.updateAttributes({verificationToken: token});
          req.flash('resetMessage', '<p class="success-message text-center">Password reset email sent.</p>');
        } else {
          //User account is not verified, can't reset password
          req.flash('resetMessage', 
            `<p class="error-message text-center">Account is not verified. Please verify email before reseting password.
            <a href="/resendVerification/${data.dataValues.username}>Resend Verification</a></p>`);
        }
      } else {
        req.flash('resetMessage', '<p class="error-message text-center">Username does not match our records</p>');
      }
  
      res.redirect('/resetRequest');
    });
  });
  
  app.get('/resendVerification/:username', (req, res) => {
    db.users.findOne({where: {username: req.params.username}}).then(user => {
      let verificationToken = randomstring.generate(16);
      user.updateAttributes({verificationToken: verificationToken});
      req.flash('loginMessage', '<p class="success-message text center">Verification email sent to email on file for account.</p>');
      res.redirect('/');
    });
  });
  
  app.get('/reset/:username/:token', (req, res) => {
    db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
      if (data) {
        res.render('resetForm');
      } else {
        req.flash('loginMessage', '<p class="error-message">Invalid password reset token. Please contact support.</p>');
        res.redirect('/');
      }
    });
  });
  
  app.post('/reset/:username/:token', (req, res) => {
    db.users.findOne({where: {username: req.params.username, verificationToken: req.params.token}}).then(data =>{
      if (data) {
        data.updateAttributes({
          password: bcrypt.hashSync(req.body.password, null, null),
          verificationToken: randomstring.generate(16)
        });
        req.flash('loginMessage', '<p class="success-message text-center">Password reset succesful. Please login with new password.</p>');
        res.redirect('/');
      } else {
        req.flash('loginMessage', '<p class="error-message text-center">Invalid password reset token. Please contact support.</p>');
        res.redirect('/');
      }
    });
  });
}