var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();


var db = require("../models/");

// var article = require("../models/articles.js");


router.get("/scrape", function(req, res) {

  request("https://davidwalsh.name/", function(error, response, html) {
  
    var $ = cheerio.load(response.body);

    // console.log(response)

    $("li", ".post-list").each(function(i, element) {
     
      // console.log(element);
      // console.log(test)
     
      var result = {};

      if ($(this).text()) {

        result.title = $(this)
        .children("h2")
        .text()
      
      result.body = $(this)
        .children(".preview")
        .text();

      result.link = $(this)
        .children("h2")
        .children("a")
        .attr("href");
        
      }

      
     


        res.json(result);

     
      db.articles.create(result)
        .then(function(dbArticle) {
          
          console.log(dbArticle)
          
        })
        .catch(function(err) {
          
          return res.json(err);
        });
    });

    //  res.redirect("/");
    // res.json("Screppp")

  })

});



module.exports = router;