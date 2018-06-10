var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var db2 = require("./models_2");

var PORT = process.env.PORT || 3000;


var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Connect to the Mongo DB
//process.env.MONGODB_URI || 
mongoose.connect("mongodb://localhost/GNewsDaily");
// When the server starts, create and save a new Library document to the db
// The "unique" rule in the Library model's schema will prevent duplicate libraries from being added to the server
var articledata = [];








db2.Articles.deleteMany({});
db2.Articles.create({title: "Test",
                     summary: "Testicles 1,2, 3?",
                     link: "link",
                     imglink: "imglink"})
  .then(function(dbGNewsDaily) {
    // If saved successfully, print the new Library document to the console
    console.log(dbGNewsDaily);
  })
  .catch(function(err) {
    // If an error occurs, print it to the console
    console.log(err.message);
  });



//var mod = require('./models/burgers');
//mod.insertaburger();
var routes = require("./controllers/article_controller.js");

app.use(routes);

app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});