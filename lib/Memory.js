"use strict";

const { setTimeout } = require("node:timers/promises");

const instances = new Map();

class Memory {
  constructor(collection) {
    const instance = instances.get(collection);
    if (instance) return instance;
    this.collection = collection;
    const storage = new Map();
    this.instance = storage;
    instances.set(collection, this);
  }

  async get(name) {
    try {
      return await setTimeout(0, this.instance.get(name));
    } catch {
      return;
    }
  }

  async set(name, data) {
    try {
      await setTimeout(0, this.instance.set(name, data));
      return true;
    } catch {
      return false;
    }
  }

  async clear() {
    try {
      await setTimeout(0, this.instance.clear());
      return true;
    } catch {
      return false;
    }
  }

  async delete(name) {
    try {
      return setTimeout(0, this.instance.delete(name));
    } catch {
      return false;
    }
  }

  async has(name) {
    try {
      return setTimeout(0, this.instance.has(name));
    } catch {
      return false;
    }
  }

  [Symbol.asyncIterator]() {
    const entries = this.entries();
    return {
      async next() {
        for (const entry of entries) {
          await setTimeout(0);
          return { value: entry, done: false };
        }
      }
    }
  }

  entries() {
    return this;
  }

  async *values() {
    for await (const entry of this) {
      yield entry[1];
    }
  }

  async *keys() {
    for await (const [key] of this) {
      yield key;
    }
  }

  pick(name, target, ...params) {
    return new Promise(resolve => {
      target(...params, (err, data) => {
        if (err) return void resolve(false);
        this.set(name, data)
          .then(() => void resolve(true))
          .catch(() => void resolve(false));
      });
    })
  }

  get size() {
    return setTimeout(0, this.size);
  }

  static truncate = async () => {
    await setTimeout(0, instances.forEach(instance => void instance.clear()));
  }

  static destroy = async () => {
    await Memory.truncate();
    await setTimeout(0, instances.clear());
  }

  static location = () => { };
};

module.exports = Memory;
