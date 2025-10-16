"use strict";

const { describe, it } = require("node:test");
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Storage = require("../lib/MemoryStorage.js");

describe('MemoryStorage', async () => {
  await it('pick', async () => {
    const storage = new Storage("test-1");
    await storage.pick("file", fs.readFile, __filename);
    assert.ok(Buffer.isBuffer(await storage.get("file")));
  });

  await it('set', async () => {
    const storage = new Storage("test-2");
    const status = "active";
    await storage.set("abc", status);
    const data = await storage.get("abc");
    assert.equal(data, status);
  });

  await it('keys', async () => {
    const storage = new Storage("test-3");
    const data = { a: 1, b: 2, c: 3 };
    const entries = Object.entries(data);
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const key of storage.keys()) {
      assert.equal(key, iter.next().value[0]);
    }
  });

  await it('values', async () => {
    const storage = new Storage("test-4");
    const data = { a: 1, b: 2, c: 3 };
    const entries = Object.entries(data);
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const value of storage.values()) {
      assert.equal(value, iter.next().value[1]);
    }
  });

  await it('entries', async () => {
    const storage = new Storage("test-5");
    const entries = Object.entries({ a: 1, b: 2, c: 3 });
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const [key, value] of storage.entries()) {
      const [expectedKey, expectedValue] = iter.next().value;
      assert.equal(key, expectedKey);
      assert.equal(value, expectedValue);
    }
  });

  await it('delete', async () => {
    const storage = new Storage("test-6");
    const data = { greet: "hello" };
    await storage.set("a", data);
    assert.deepEqual(await storage.get("a"), data);
    assert.ok(await storage.delete("a"));
    assert.equal(await storage.get("a"), undefined);
  });

  await it('has', async () => {
    const storage = new Storage("test-7");
    const data = { greet: "hello" };
    await storage.set("a", data);
    assert.equal(await storage.has("a"), true);
    assert.deepEqual(await storage.get("a"), data);
  });

  await it('clear', async () => {
    const storage = new Storage("test-8");
    const entries = Object.entries({ a: 1, b: 2, c: 3 });
    const iter = entries.values();
    for (const [key, value] of entries) {
      await storage.set(key, value);
    }
    for await (const key of storage.keys()) {
      const expected = iter.next().value[0];
      assert.equal(key, expected);
    }
    await storage.clear();
    const size = await storage.size;
    assert.equal(size, 0);
  });

  await it('asyncIter', async () => {
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
  });

  await it('singleton', async () => {
    const storage = new Storage("singleton");
    const storage2 = new Storage("singleton");
    const storage3 = new Storage("singleton");
    assert.deepEqual(storage, storage2, storage3);
  });

  await it('truncate', async () => {
    await Storage.truncate();
  });

  await it('destroy', async () => {
    await Storage.destroy();
  });
});
