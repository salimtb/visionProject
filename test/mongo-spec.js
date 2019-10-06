const expect = require("chai").expect;
const Product = require("../products/product.model");
const mongoose = require("mongoose");
const nock = require("nock");
const app = require("../webserver");
const request = require("supertest");
const agent = request.agent(app);

describe("api/products", function() {
  before("connect", function() {
    return mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost/vision",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    );
  });
  this.beforeEach(async () => {
    await Product.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all products", async () => {
      const res = await agent.get("/product/test");

      expect(res.status).to.equal(200);

      expect(res.body.success).to.equal(true);
    });
  });

  describe("POST /", () => {
    it("should create products", async () => {
      const product = {
        id: "L1212-00-001",
        title: "Polo Lacoste L.12.12 uni",
        gender_id: "MAN",
        composition: "100% Coton",
        sleeve: "Manches courtes",
        photo:
          "//image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1212_001_24.jpg?sw=458&sh=443",

        url:
          "https://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-l.12.12-uni/L1212-00.html?dwvar_L1212-00_color=001"
      };

      const res = await agent
        .post("/product/create")
        .send(product)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);

      expect(res.body.success).to.equal(true);
    });
  });
});
