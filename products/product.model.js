"use strict";

const mongoose = require("mongoose");
require("mongoose-type-url");
const Schema = mongoose.Schema;

/**
 * MyClientSchema schema
 * @constructor Product
 */
const schema = new Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  gender_id: { type: String, unique: false, required: true },
  composition: { type: String, required: true },
  sleeve: { type: String, required: false },
  photo: { type: String, required: false },
  url: { type: mongoose.SchemaTypes.Url, required: true },
  score: { type: Number },
  rgb: [Number, Number, Number]
});

schema.set("toJSON", {
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  }
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
