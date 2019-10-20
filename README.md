## Project using google/vision api

this project allows you to :

- import data of some product from csv to mongo db data base
- get dominant color of your products list and persist it in data base
- get color proximity of some product

## Installation

- before , make sure that you have already installed mongo DB in your machine , if you don't you can use this link :
  https://docs.mongodb.com/manual/installation/

- run your mongo DB in localhost
- go to the root and execute the command `npm install`
- run `npm start`

## Usage

- to import data product from csv file goes to the root and use this command :

  `node import-csv -f <root of your csv file>`

- to get the dominant color of your products list and persist it in data base use this command :
  (be carefull this command allow you only to update your product, you cannot create product with it )

  `node import-csv -g <root of your csv file>`

- endpoint api to get suggestions about proximity color of some product
  `http://localhost:8080/product/colorProximity/:id`

- to run unit test you can use this command :
  (make surre that your server is down)

  `grunt run:test`

- to see api doc you can run :
  `http://localhost:8080/api-docs`
