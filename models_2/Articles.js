var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  Title: String,
  Summary: String,
  Link: String,
  ImgLink: String,
  Author: String
});
var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;