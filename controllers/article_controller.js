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
var HighLight = 'style="font-weight:600; color:#007bff"';
var LowLight = 'style="font-weight:100; color:#5e6a77"';
//mod = require('../models/burgers');
var mod2= require('../models_2/')
var arrOut = [];

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
console.log('start');
arrOut.length=0;
console.log('requestive massively');
request("http://massivelyop.com/", function(error, response, html) {
 let $ = cheerio.load(html);
 let iEnd = 8;
$("article.post").each(function(i,element){
  if(i<iEnd){
  let link = 'http://massivelyop.com/' + $(element).children("h2").children().attr("href");
  let title = $(element).children("h2").text();  
  let summary = $(element).children(".entry").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  let linkimg = $(element).children("a").children("img").attr("src");
  let out = new Article(title, summary, link, linkimg, '');
  if (summary.length > 100){
    arrOut.push(out);
  } else {if(iEnd<25){iEnd++}};
 
  }
});
console.log('done massively');
console.log('requestive mmorpg');
request("https://www.mmorpg.com/", function(error, response, html) {
    let $ = cheerio.load(html);
    let iEnd = 8;
    $(".newsitem").each(function(i,element){
      if(i<iEnd){
      let link = 'https://www.mmorpg.com/' + $(element).children("h3").children().attr("href");
      let title = $(element).children("h3").text();  
      let summary = $(element).children(".news_newspost").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"")
      
      let linkimg = $(element).children(".news_newspost").children("a").children("img").attr("src");
      let out = new Article(title, summary, link, linkimg, '');
      if (summary.length > 100){
        arrOut.push(out);
      } else {if(iEnd<25){iEnd++}};
     
      }
     });
     //console.log('Articles---->', arrOut);
     console.log('done mmorpg');   
     var artObject = {
      articles: arrOut,      
      styleHomeLink: HighLight,
      styleSavedLink: LowLight,
      styleAboutLink: LowLight,
      btnSave: "style='color:white;'"}; 
    console.log('render');
    return (res.render("index", artObject));
    })

}) 


}
router.get("*", function(req, res) {  
  
    if(arrOut.length<1){
      getFreshArticles(res);
    }else{
      var artObject = {
        articles: arrOut,
        styleHomeLink: HighLight,
        styleSavedLink: LowLight,
        styleAboutLink: LowLight,
        btnSave: "style='color:white;'"
      }; 
      return (res.render("index", artObject));
    }
    
    
  

  
});

router.post("/api/burgers/", function(req,res){
  //mod.insertaburger(function(result) {
  //  res.json({ id: result.insertId });}, {BURGER_NAME: req.body.BURGER_NAME, DEVOURED: req.body.DEVOURED});
});

router.put("/api/burgers/:id", function(req, res) {
  // mod.updateaburger(function(result) {
  //  if (result.changedRows === 0) {
  //   
  //    return res.status(403).end();
  //  }
  //  res.status(200).end();}, {DEVOURED: req.body.DEVOURED}, req.params.id);
});
router.delete("/api/burgers/", function(req, res) {
  
    //mod.deleteburgers(function(result) {
    //  res.status(200).end();},  {DEVOURED: 1});
  
  
});
router.delete("/api/burgers/:id", function(req, res) {
  //if(req.params.id){
  //  mod.deleteburgers(function(result) {
 //     res.status(200).end();},  {id: req.params.id});
 // }
  
});


module.exports=router;





