const expect = require("chai").expect;
const Product = require("../products/product.model");
const mongoose = require("mongoose");
const nock = require("nock");
const app = require("../webserver");
const request = require("supertest");
const agent = request.agent(app);

describe("api/products", function() {
  before("connect", function() {
    const productData = {
      id: "Test",
      title: "Polo Lacoste L.12.12 uni",
      gender_id: "MAN",
      composition: "100% Coton",
      sleeve: "Manches courtes",
      photo:
        "//image1.lacoste.com/dw/image/v2/AAQM_PRD/on/demandware.static/Sites-FR-Site/Sites-master/default/L1212_001_24.jpg?sw=458&sh=443",

      url:
        "https://www.lacoste.com/fr/lacoste/homme/vetements/polos/polo-lacoste-l.12.12-uni/L1212-00.html?dwvar_L1212-00_color=001"
    };
    const product = new Product(productData);
    product.save();

    const Mockgoose = require("mockgoose").Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(() => {
      mongoose
        .connect("mongodb://localhost/vision", {
          useNewUrlParser: true,
          useCreateIndex: true
        })
        .then((res, err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
    });
  });
  after(async () => {
    await Product.remove({ id: "Test" });
    await Product.remove({ id: "Test2" });
  });

  describe("POST /", () => {
    it("should create products", async () => {
      const product = {
        id: "Test2",
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

      expect(res.body).to.deep.equal(product);
    });
  });

  describe("PUT /", () => {
    it("should create products", async () => {
      const product = {
        id: "Test",
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
        .put("/product/dominantColor")
        .send(product)
        .set("Accept", "application/json");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("score");
      expect(res.body).to.have.property("rgb");
    }).timeout(500000);
  });
});
