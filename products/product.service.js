"use strict";

const express = require("express");
const db = require("../_helpers/mongo");
const path = require("path");
const vision = require("@google-cloud/vision");
const colorProximity = require("colour-proximity");
const rgbHex = require("rgb-hex");

const Product = db.Product;

const router = express.Router();

/**
 * Create product and persist in data base
 * @param {string} - A json param of Product
 * @return {object}
 */
async function createProduct(req, res) {
  try {
    const product = req.body;

    await create(product);

    res.json(product);
  } catch (e) {
    res.json(e);
  }
}

async function getAllProducts(req, res) {
  try {
    const product = req.body;
    const products = await Product.find({});
    const userMap = {};
    const userTab = [];
    products.forEach(user => {
      userTab.push((userMap[user.id] = user));
    });

    res.json(userTab);
  } catch (e) {
    res.json(e);
  }
}

/**
 * find proximity colors of some product
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object}
 */
async function colorProximityEndPoint(req, res) {
  try {
    const productId = req.params.id;

    const productFound = await findById(productId);

    // loop over all items and extract product with similar colors
    Product.find({}, function(err, products) {
      let productSimilarColors = [];
      products.forEach(product => {
        // we should ignore our product
        if (product.id !== productFound.id) {
          const distance = colorProximity.proximity(
            `#${rgbHex(...productFound.rgb)}`,
            `#${rgbHex(...product.rgb)}`
          );
          if (distance <= 1) {
            productSimilarColors.push(product);
          }
        }
      });
      res.json(productSimilarColors);
    });
  } catch (e) {
    res.json(e);
  }
}

/**
 * Request google cision api and add dominate color
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} - A json param of Product with dominate color
 */
async function domiantColorEndPoint(req, res) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  const product = req.body;
  try {
    const results = await client.imageProperties(`https:${product.photo}`);
    const dominantColors = {
      score:
        results[0].imagePropertiesAnnotation.dominantColors.colors[0].score *
        100,
      rgb: [
        results[0].imagePropertiesAnnotation.dominantColors.colors[0].color.red,
        results[0].imagePropertiesAnnotation.dominantColors.colors[0].color
          .green,
        results[0].imagePropertiesAnnotation.dominantColors.colors[0].color.blue
      ]
    };

    // find the updated product and send it
    const productNotUpdated = await Product.findOne({ id: product.id });
    if (productNotUpdated) {
      await update(product, dominantColors);

      const productUpdated = await Product.findOne({ id: product.id });
      res.json(productUpdated);
    } else {
      throw {
        status: 404,
        message: "product not found"
      };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Create product and persist in data base
 * @param {string} productParam - A json param of Product
 * @return {object}
 */
async function create(productParam) {
  // validate
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
}

/**
 * Find product by Id
 * @param {string} productId - A json param of id product
 * @return {object}
 */
async function findById(productId) {
  // validate
  const product = await Product.findOne({ id: productId });
  if (product) {
    return product;
  } else {
    throw {
      status: 404,
      message: "product Not Found"
    };
  }
}
/**
 * Update product and add informations
 * @param {string} productParam - json param of id product
 * @param {string} dominantColors - information to add
 * @return {object}
 */
async function update(productParam, dominantColors) {
  const productWithColors = { ...productParam, ...dominantColors };
  await Product.updateOne(productParam, productWithColors);
  return productWithColors;
}

router
  .get("/colorProximity/:id", colorProximityEndPoint)
  .get("/allProducts", getAllProducts)
  .post("/create", createProduct)
  .put("/dominantColor", domiantColorEndPoint);

module.exports = router;
