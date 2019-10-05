const assert = require("chai").assert;

describe("Testing the routes", function() {
  before("connect", function() {
    return mongoose.createConnection("mongodb://localhost/books");
  });
});
