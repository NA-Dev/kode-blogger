// app/routes.js

module.exports = (app, passport) => {

  app.post('/users/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return res.status(401).send({message: err}); }
      if (!user) { return res.status(401).send({message: 'Invalid username/password'}); }
      req.logIn(user, function(err) {
        if (err) { return res.status(401).send({message: err}); }
        return res.sendStatus(200);
      });
    })(req, res, next);
  });

    // process the signup form
  app.post('/users/signup', passport.authenticate('local-signup', {
    successRedirect : '/', 
    failureRedirect : '/', 
    failureFlash : true 
  }));

  app.get('/users/loggedIn', loggedIn, (req, res) => {
    res.send({username: req.user.username});
  })

  app.get('/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.sendStatus(403, 'Not Logged In');
    }
  }
}