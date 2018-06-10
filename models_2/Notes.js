var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  note: String,
  articles: [{
    type: Schema.Types.ObjectId,
    ref: "Articles"
  }]
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;