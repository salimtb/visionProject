"use strict";

const program = require("commander");
const csv = require("csv-parser");
const fs = require("fs");
const superagent = require("superagent");

program
  .version("1.0.0")
  .option("-f, --file", "import csv file in mongo database")
  .option("-d, --download", "download csv file");

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

if (program.download) {
  superagent
    .get("localhost:8080/product/test")
    .responseType("blob")
    .end((error, res) => {
      if (error) {
        console.log(`Error in download`);
      } else {
        console.log(res.body.toString());
      }
    });
}
