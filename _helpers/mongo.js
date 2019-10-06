const config = require("../config.json");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;

module.exports = {
  Product: require("../products/product.model")
};
