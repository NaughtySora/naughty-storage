'use strict';
const File = require("../lib/File.js");
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
      console.log(reason)
      results.push(reason);
      status.push({ name: test.name, status: "FAIL" });
    }
  }
  results.length && console.table(results);
  console.table(status);
};

const pick = async () => {
  const saver = new File("test-1");
  await saver.pick("file", fs.readFile, __filename);
  const output = await saver.get("file");
  const buffer = Buffer.from(output);
  assert(Buffer.isBuffer(buffer));
};

const set = async () => {
  const saver = new File("test-2");
  const status = "active";
  await saver.set("abc", status);
  const data = await saver.get("abc");
  assert.strictEqual(data, status);
};

const keys = async () => {
  const saver = new File("test-3");
  const data = { a: 1, b: 2, c: 3 };
  const entries = Object.entries(data);
  const iter = entries.values();
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  for await (const key of saver.keys()) {
    const expected = iter.next().value[0];
    assert.strictEqual(key, expected);
  }
};

const values = async () => {
  const saver = new File("test-4");
  const data = { a: 1, b: 2, c: 3 };
  const entries = Object.entries(data);
  const iter = entries.values();
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  for await (const value of saver.values()) {
    assert.strictEqual(value, iter.next().value[1]);
  }
};

const entries = async () => {
  const saver = new File("test-5");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  const iter = entries.values();
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  for await (const [key, value] of saver.entries()) {
    const [expectedKey, expectedValue] = iter.next().value;
    assert.strictEqual(key, expectedKey);
    assert.strictEqual(value, expectedValue);
  }
};

const del = async () => {
  const saver = new File("test-6");
  const data = { greet: "hello" };
  await saver.set("a", data);
  const expected = await saver.get("a");
  assert.deepEqual(expected, data);
  await saver.delete("a");
  const valueGone = await saver.get("a");
  assert.deepEqual(valueGone, null);
};

const has = async () => {
  const saver = new File("test-7");
  const data = { greet: "hello" };
  await saver.set("a", data);
  assert.strictEqual(await saver.has("a"), true);
  assert.deepEqual(await saver.get("a"), data);
};

const clear = async () => {
  const saver = new File("test-8");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  const iter = entries.values();
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  for await (const key of saver.keys()) {
    const expected = iter.next().value[0];
    assert.strictEqual(key, expected);
  }
  await saver.clear();
  assert.strictEqual(await saver.size, 0);
};

const asyncIter = async () => {
  const saver = new File("test-9");
  const entries = Object.entries({ a: 1, b: 2, c: 3 });
  for (const [key, value] of entries) {
    await saver.set(key, value);
  }
  let idx = 0;
  for await (const entry of saver) {
    assert.deepEqual(entry, entries[idx]);
    idx++;
  }
};

const singleton = async () => {
  const saver = new File("singleton");
  const saver2 = new File("singleton");
  const saver3 = new File("singleton");
  assert.deepEqual(saver, saver2, saver3);
};

const truncate = async () => File.truncate();
const destroy = async () => File.destroy();

start([pick, set, keys, values, entries, del, has, clear, asyncIter, singleton, destroy, truncate]);