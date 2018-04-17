const express = require('express');
const router = express.Router();

const db = require('../models');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require('randomstring');

// router.get('/postNote', (req, res) => {
//     res.render('post', {message: req.flash('resetMessage'), showResetForm: true});
//   });

router.post('/notes/:postId', (req, res) => {
  console.log(req.body.content.length);
  if (req.body.content.length > 1) {
    db.notes.create({content: req.body.content, articleId: req.params.postId}).then( data => {
      res.json(data);
    })
  } else {
    res.status(400).send();
  }
})

router.get('/notes/:postId', (req, res) => {
  db.notes.findAll({where: {articleId: req.params.postId}}).then(data => {
    res.send(data);
  });
})

router.get('/notes/read/', (req, res) => {
  db.notes.findAll().then( data => {
    res.json("reading");
  });
});

router.get('/notes/read/:id', (req, res) => {
    db.notes.findOne({where: {id: req.params.id}}).then( data => {
      res.json("reading");
    });
  });


module.exports = router;