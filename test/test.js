"use strict";

const fs = require("node:fs");
const assert = require("node:assert");

const test = async (tests) => {
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

module.exports = (Storage) => {
  const pick = async () => {
    const storage = new Storage("test-1");
    await storage.pick("file", fs.readFile, __filename);
    const output = await storage.get("file");
    assert(Buffer.isBuffer(output));
  };

  const set = async () => {
    const storage = new Storage("test-2");
    const status = "active";
    await storage.set("abc", status);
    const data = await storage.get("abc");
    assert.strictEqual(data, status);
  };

  const keys = async () => {
    const storage = new Storage("test-3");
    const data = { a: 1, b: 2, c: 3 };
    const entries = Object.entries(data);
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const key of storage.keys()) {
      const expected = iter.next().value[0];
      assert.strictEqual(key, expected);
    }
  };

  const values = async () => {
    const storage = new Storage("test-4");
    const data = { a: 1, b: 2, c: 3 };
    const entries = Object.entries(data);
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const value of storage.values()) {
      assert.strictEqual(value, iter.next().value[1]);
    }
  };

  const entries = async () => {
    const storage = new Storage("test-5");
    const entries = Object.entries({ a: 1, b: 2, c: 3 });
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const [key, value] of storage.entries()) {
      const [expectedKey, expectedValue] = iter.next().value;
      assert.strictEqual(key, expectedKey);
      assert.strictEqual(value, expectedValue);
    }
  };

  const del = async () => {
    const storage = new Storage("test-6");
    const data = { greet: "hello" };
    await storage.set("a", data);
    const expected = await storage.get("a");
    assert.deepEqual(expected, data);
    await storage.delete("a");
    const valueGone = await storage.get("a");
    assert.deepEqual(valueGone, null);
  };

  const has = async () => {
    const storage = new Storage("test-7");
    const data = { greet: "hello" };
    await storage.set("a", data);
    assert.strictEqual(await storage.has("a"), true);
    assert.deepEqual(await storage.get("a"), data);
  };

  const clear = async () => {
    const storage = new Storage("test-8");
    const entries = Object.entries({ a: 1, b: 2, c: 3 });
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const key of storage.keys()) {
      const expected = iter.next().value[0];
      assert.strictEqual(key, expected);
    }
    await storage.clear();
    const size = await storage.size;
    assert.strictEqual(size, 0);
  };

  const asyncIter = async () => {
    const storage = new Storage("test-9");
    const entries = Object.entries({ a: 1, b: 2, c: 3 });
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    let idx = 0;
    for await (const entry of storage) {
      assert.deepEqual(entry, entries[idx]);
      idx++;
    }
  };

  const singleton = async () => {
    const storage = new Storage("singleton");
    const storage2 = new Storage("singleton");
    const storage3 = new Storage("singleton");
    assert.deepEqual(storage, storage2, storage3);
  };

  const truncate = async () => Storage.truncate();
  const destroy = async () => Storage.destroy();

  test([pick, set, keys, values, entries, del, has, clear, asyncIter, singleton, destroy, truncate]);
};
