'use strict';
const Memory = require("../lib/Memory.js");
const fs = require("node:fs");
const assert = require("node:assert");

const start = async (tests) => {
  const results = [];
  const status = [];
  for (const test of tests) {
    try {
      await test();
      status.push({ name: test.name, status: "SUCCESS" });
    } catch (reason) {
      results.push(reason);
      status.push({ name: test.name, status: "FAIL" });
    }
  }
  results.length && console.table(results);
  console.table(status);
};

const pick = async () => {
  const saver = new Memory("test-1");
  const file = fs.readFile.bind(null, "./test.js");
  await saver.pick("file", file);
  assert(Buffer.isBuffer(await saver.get("file")))
};

const set = async () => {
  const saver = new Memory("test-2");
  const status = "active";
  await saver.set("abc", status);
  assert.strictEqual(await saver.get("abc"), status);
};

const keys = async () => {
  const saver = new Memory("test-3");
  const data = { a: 1, b: 2, c: 3 };
  const entries = Object.entries(data);
  const expect = Object.keys(data);
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  assert.deepStrictEqual(await saver.keys(), expect);
};

const values = async () => {
  const saver = new Memory("test-4");
  const data = { a: 1, b: 2, c: 3 };
  const entries = Object.entries(data);
  const expect = Object.values(data);
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  assert.deepStrictEqual(await saver.values(), expect);
};

const entries = async () => {
  const saver = new Memory("test-5");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  assert.deepStrictEqual(await saver.entries(), entries);
};

const del = async () => {
  const saver = new Memory("test-6");
  const data = { greet: "hello" };
  await saver.set("a", data);
  assert.deepStrictEqual(await saver.get("a"), data);
  await saver.delete("a");
  assert.deepStrictEqual(await saver.get("a"), undefined);
};

const has = async () => {
  const saver = new Memory("test-7");
  const data = { greet: "hello" };
  await saver.set("a", data);
  assert.strictEqual(await saver.has("a"), true);
  assert.deepStrictEqual(await saver.get("a"), data);
};

const clear = async () => {
  const saver = new Memory("test-8");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  const keys = Object.keys({ a: 1, b: 2, c: 3 });
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  assert.deepStrictEqual(await saver.keys(), keys);
  await saver.clear();
  assert.deepStrictEqual(await saver.keys(), []);
};

const asyncIter = async () => {
  const saver = new Memory("test-9");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  let idx = 0;
  for await (const entry of saver) {
    assert.deepStrictEqual(entry, entries[idx]);
    idx++;
  }
};

const singleton = async () => {
  const saver = new Memory("singleton");
  const saver2 = new Memory("singleton");
  const saver3 = new Memory("singleton");
  assert.deepStrictEqual(saver, saver2, saver3);
};

start([pick, set, keys, values, entries, del, has, clear, asyncIter, singleton]);