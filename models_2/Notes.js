var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  note: String
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;