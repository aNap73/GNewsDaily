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
var mod2= require('../models_2/');
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
const getArticleFromArray = (res, Title,cb) => {
  console.log(Title);
  let MyArt = {};
  for (let Art of arrOut) {   
    if(Art.Title === Title){
      MyArt = Art;
      break;    
    }
  }
  return cb(MyArt, res);
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
  //let summary = $(element).children("entry").children("p").toString().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  let summary = $(element).children(".entry").children("p").html().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  if(!summary){
    summary = $(element).children(".entry").html().replace(/<\/?(?!p)\w*\b[^>]*>/g, "").replace(/&#x[^\s][^\s][^\s][^\s];/g,"").replace(/<p> Read more<\/p>|<p> Comment<\/p>/g,"");
  }
  let linkimg = $(element).children("a").children("img").attr("src");
  
  if ((!summary)||((summary!==null)&&(summary.length > 100))){
    let out = new Article(title, summary, link, linkimg, '');
    arrOut.push(out);
  } else {if(iEnd<25){iEnd++}};
 
  }
});
console.log('done massively');
console.log('requestive mmorpg');
request("https://www.mmorpg.com/", function(error, response, html) {
    let $ = cheerio.load(html);
    let iEnd = 16;
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
router.get("/api/save/:Tit", function(req,res){
  if (arrOut.length===0){
    res.redirect("/");
    return;
  }
  getArticleFromArray(res, req.params.Tit, function(Art, res){
    console.log('SAVE ME');
    console.log(Art);
    mod2.Articles.create(Art)
    .then(function(dbGNewsDaily) {
      res.json({dbGNewsDaily});  
   })
  .catch(function(err) {    
    res.json({err});
  });
  });
  
});
  
  
  
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


module.exports=router;





