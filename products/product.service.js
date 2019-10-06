"use strict";

const express = require("express");
const db = require("../_helpers/mongo");
const path = require("path");
const Product = db.Product;

const router = express.Router();

function product(req, res) {
  res.sendFile(path.join(__dirname, "../data", "test.csv"));
}

async function createProduct(req, res) {
  const product = req.body;

  await create(product);

  res.send({ success: true });
}

async function create(productParam) {
  // validate
  try {
    const exist = await Product.findOne({ id: productParam.id });
    if (exist) {
      throw {
        status: 409,
        message: "product with same id already exist"
      };
    } else {
      const product = new Product(productParam);

      product.save();
    }
  } catch (e) {
    console.log(e);
  }
}

router.get("/test", product).post("/create", createProduct);

module.exports = router;
