"use strict";

const program = require("commander");

program.option("-d, --debug").option("-f, --file");

program.parse(process.argv);

if (program.debug) {
  console.log("debug");
}

if (program.file) {
  console.log("-yes");
}
