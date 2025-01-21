'use strict';
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

  async get(name, options) {
    try {
      return await setTimeout(0, this.instance.get(name), options);
    } catch {
      return;
    }
  }

  async set(name, data, options) {
    try {
      await setTimeout(0, this.instance.set(name, data), options);
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

  async *[Symbol.asyncIterator]() {
    try {
      const promise = this.entries();
      for (const [key, value] of await promise) {
        yield [key, value];
      }
    } catch {
      return null;
    }
  }

  async entries() {
    try {
      return await setTimeout(0, this.instance.entries());
    } catch {
      return [];
    }
  }

  async values() {
    try {
      return setTimeout(0, this.instance.values());
    } catch {
      return [];
    }
  }

  async keys() {
    try {
      return setTimeout(0, this.instance.keys());
    } catch {
      return [];
    }
  }

  pick(name, target, ...params) {
    return new Promise(resolve => {
      target(...params, (err, data) => {
        if (err) return void resolve(false);
        this.set(name, data)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    })
  }

  static truncate = async () => {
    await setTimeout(0, instances.forEach(instance => void instance.clear()));
  }
  
  static destroy = async () => {
    await Memory.truncate();
    await setTimeout(0, instances.clear());
  }
  
  static location = () => {};
};

module.exports = Memory;
