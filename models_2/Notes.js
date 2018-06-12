var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  note: String,
  articleId: Schema.Types.ObjectId
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;