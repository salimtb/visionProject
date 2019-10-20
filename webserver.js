"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const config = require("./config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const product = require("./products/product.service");
const swaggerDoc = require("./doc/swagger.json");
const swaggerUi = require("swagger-ui-express");

const app = express();
const httpsPort = 8443;
const httpPort = 8080;

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/product", product);

app.get("/", (req, res) => {
  res.send("Hello");
});

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, "cert", "server.crt")),
  key: fs.readFileSync(path.join(__dirname, "cert", "server.key"))
};

https.createServer(httpsOptions, app).listen(httpsPort, () => {
  console.log("https server running");
});

http.createServer(app).listen(httpPort, () => {
  console.log("http server running");
});

mongoose
  .connect(process.env.MONGODB_URI || config.connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connect: success to data-base");
  })
  .catch(err => {
    console.log("connect: error to data-base");
    throw err;
  });

module.exports = app;
