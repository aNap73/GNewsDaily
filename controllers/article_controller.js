// #### Controller setup

// 1. Inside your `burger` directory, create a folder named `controllers`.

// 2. In `controllers`, create the `burgers_controller.js` file.

// 3. Inside the `burgers_controller.js` file, import the following:

//    * Express
//    * `burger.js`

// 4. Create the `router` for the app, and export the `router` at the end of your file.
console.log('establishing routes');
var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var request = require("request");

mod = require('../models/burgers');
mod2= require('../models_2/')

//function GetFreshArticles () {}
class Article {
  constructor(title, summary, link, imglink, author){
    this.Title = title;
    this.Summary = summary;
    this.Link = link;    
    this.ImgLink = imglink;
    this.Author = author;
  }
}
const getFreshArticles = (res) => {
let arrOut = [];
request("http://massivelyop.com/", function(error, response, html) {
var $ = cheerio.load(html);
$("article.post").each(function(i,element){
  let link = $(element).children("h2").children().attr("href");
  let title = $(element).children("h2").text();  
  let summary = $(element).children(".entry").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"")
  let linkimg = $(element).children("a").children("img").attr("src");
  let out = new Article(title, summary, link, linkimg, '');
  arrOut.push(out);
});
request("https://www.mmorpg.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    
    $(".newsitem").each(function(i,element){
      let link = $(element).children("h3").children().attr("href");
      let title = $(element).children("h3").text();  
      let summary = $(element).children(".news_newspost").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"")
      
      let linkimg = $(element).children(".news_newspost").children("a").children("img").attr("src");
      let out = new Article(title, summary, link, linkimg, '');
    
      arrOut.push(out);
    
     });
     console.log('Articles---->', arrOut);
     var artObject = {
      articles: arrOut
    };   
    res.render("index2", artObject);
    })

}) 

  return arrOut;
}
router.get("*", function(req, res) {
  
  mod.getallburgers(function(data) {

    getFreshArticles(res);
    
  });

  
});

router.post("/api/burgers/", function(req,res){
  mod.insertaburger(function(result) {
    res.json({ id: result.insertId });}, {BURGER_NAME: req.body.BURGER_NAME, DEVOURED: req.body.DEVOURED});
});

router.put("/api/burgers/:id", function(req, res) {
   mod.updateaburger(function(result) {
    if (result.changedRows === 0) {
     
      return res.status(403).end();
    }
    res.status(200).end();}, {DEVOURED: req.body.DEVOURED}, req.params.id);
});
router.delete("/api/burgers/", function(req, res) {
  
    mod.deleteburgers(function(result) {
      res.status(200).end();},  {DEVOURED: 1});
  
  
});
router.delete("/api/burgers/:id", function(req, res) {
  if(req.params.id){
    mod.deleteburgers(function(result) {
      res.status(200).end();},  {id: req.params.id});
  }
  
});


module.exports=router;





