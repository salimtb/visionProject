"use strict";

const express = require("express");
const db = require("../_helpers/mongo");
const Product = db.Product;

const router = express.Router();

function product(req, res) {
  res.send({ success: true });
}

async function createProduct(req, res) {
  const product = req.body;

  await create(product);

  res.send({ success: true });
}

function create(productParam) {
  // validate
  Product.findOne({ id: productParam.id })
    .exec()
    .then(data => {
      console.log("data");
      console.log(data);
    })
    .catch(err => {
      console.log("err");
      console.log(err);
    });

  const product = new Product(productParam);

  product.save();
}

router.get("/test", product).post("/create", createProduct);

module.exports = router;
