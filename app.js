
//jshint esversion:6
//NPM Packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const PORT = process.env.PORT;

//CONNECITONS-SETUP
mongoose.connect('mongodb://localhost:27017/wikiDB' , { useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//JS <BODY>

const articleSchema = mongoose.Schema ({
title: String,
content: String
});

const Article = mongoose.model("Article" , articleSchema);

/// ENTIRE ARTILE REQUESTS//////
app.route("/articles").get(function(req, res){

  Article.find(function(err , results) {
    if(!err){
        res.send(results);
    }else {
      res.send(err);
    }
});
})

.post(function(req, res){

const newArticle = new Article(
  {title: req.body.title ,
    content: req.body.content
    });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.")
    }else {
      res.send(err);
    }
  });
})

.delete(function(req , res){

Article.deleteMany( function (err){
  if(!err){
    res.send("Successfully deleted all  articles.")
  }else {
    res.send(err);
  }
  });
});

////SPECIFIC ARTICLE REQUESTS ////
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle} , function(err , foundArticle) {
    //Article will find SPECIFIC {condition} of title which is equal to the request paramater of articleTitle in our URL. req.param is from Express route paramater documentation.
    if(foundArticle){
        res.send(foundArticle);
    }else {
      res.send("There are no matching articles found.");
    }
});
})

.put(function(req , res){

Article.update(
  {title: req.params.articleTitle},
  {title: req.body.title, content: req.body.content},
  {overwrite:true},
function(err){
  if(!err){
    res.send("Successfully updated article");
      }
    })
})
.patch(function (req, res) {
  Article.update({title: req.params.articleTitle}, {$set: req.body},
function(err, updatedResults){
  if(!err){
  res.send(updatedResults);
  }else {
    res.send(err);
  }
}
  )
})

.delete(function (req , res){
Article.deleteOne({title: req.params.articleTitle} , function (err) {
  if(!err){
    res.send("Successfully Deleted Specified Article.")
  }else{
    res.send(err)
  }
})


});



















// PORT CONNECITONS //
app.listen(3000 || PORT, function() {
  console.log("Server started on port 3000");
});
