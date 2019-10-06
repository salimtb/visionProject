"use strict";

const mongoose = require("mongoose");
require("mongoose-type-url");
const Schema = mongoose.Schema;

const schema = new Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  gender_id: { type: String, unique: false, required: true },
  composition: { type: String, required: true },
  sleeve: { type: String, required: false },
  photo: { type: String, required: false },
  url: { type: mongoose.SchemaTypes.Url, required: true }
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
