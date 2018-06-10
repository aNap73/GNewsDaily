var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: String,
  summary: String,
  link: String,
  imglink: String,
  author: String
});
var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;