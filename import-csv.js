"use strict";

const program = require("commander");
const csv = require("csv-parser");
const fs = require("fs");
const superagent = require("superagent");
const vision = require("@google-cloud/vision");

program
  .version("1.0.0")
  .option("-f, --file", "import csv file in mongo database")
  .option("-g, --google", "pick up informations about picture");

program.parse(process.argv);
if (program.file) {
  let stream = fs.createReadStream(program.args[0]);
  let results = [];
  stream
    .pipe(csv({ separator: ";" }))
    .on("data", data => results.push(data))
    .on("end", () => {
      results.forEach(product => {
        superagent
          .post("localhost:8080/product/create")
          .send(product)
          .end((error, res) => {
            error
              ? console.log(`Error in create product ${product.title}`)
              : console.log(`Product ${product.title} created`);
          });
      });
    });
}

if (program.google) {
  let stream = fs.createReadStream(program.args[0]);
  let results = [];
  stream
    .pipe(csv({ separator: ";" }))
    .on("data", data => results.push(data))
    .on("end", () => {
      results.forEach(product => {
        superagent
          .put("localhost:8080/product/google")
          .send(product)
          .end((error, res) => {
            error
              ? console.log(`Error in create product ${product.title}`)
              : console.log(
                  `Product dominant color for ${product.title} added`
                );
          });
      });
    });
}
