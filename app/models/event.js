const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
const eventSchema = new Schema({
  name: String,
  slug: {
    type: String,
    unique: true,
  },
  description: String,
});

// define middleware --------
// make sure that slug is created from the name
eventSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

// create the model
const eventModel = mongoose.model("Event", eventSchema);

// export the model
module.exports = eventModel;

// slugify function get from https://andrew.stwrt.ca/posts/js-slugify/
function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
