"use strict";

const Memory = require("../lib/Memory");
const File = require("../lib/File");

const test = require("./test");

(async () => {
  await test(Memory);
  // await test(File);
})();
