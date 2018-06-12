const dbreset = false;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");
var db2 = require("./models_2");
var routes = require("./controllers/article_controller.js");

var PORT = process.env.PORT || 3000;


var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
app.use(routes);
// Connect to the Mongo DB
//process.env.MONGODB_URI ||

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/GNewsDaily";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
if(dbreset){
  db2.Articles.remove({}, function(){});
  db2.Notes.remove({}, function(){});}
app.listen(PORT, function() {
    console.log("App now listening at localhost:" + PORT);
  });



 
