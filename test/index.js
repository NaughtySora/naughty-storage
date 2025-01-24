"use strict";

const MemoryStorage = require("../lib/MemoryStorage");
const FileStorage = require("../lib/FileStorage");

const test = require("./test");

test(MemoryStorage);
test(FileStorage);
