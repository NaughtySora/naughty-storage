

"use strict";

const { promises: fs, accessSync, mkdirSync } = require("node:fs");
const { setTimeout } = require("node:timers/promises");
const path = require("node:path");

const settings = {
  _location: __dirname,
  _created: false,
  get created() {
    return this._created;
  },
  get location() {
    return this._location;
  },
  get warehouse() {
    return path.resolve(`${this.location}/__storage`);
  },
};

const ENCODING = "utf8";
const instances = new Map();

const json = name => `${name}.json`;
const cutExt = name => name.replace(/.json$/, "");
const createFolder = (path) => {
  try {
    accessSync(path);
  } catch {
    mkdirSync(path);
  }
};
const isBuffer = (data) => typeof data === "object" && data?.type === "Buffer";

class FileStorage {
  constructor(collection) {
    if (!settings.created) createFolder(settings.warehouse);
    const instance = instances.get(collection);
    if (instance) return instance;
    this.collection = collection;
    const collectionPath = path.join(`${settings.warehouse}/${collection}`);
    this.path = collectionPath;
    createFolder(collectionPath);
    instances.set(collection, this);
  }

  #key(name) {
    return path.join(this.path, json(name));
  }

  async get(name) {
    try {
      const data = await fs.readFile(this.#key(name), { encoding: ENCODING });
      const result = JSON.parse(data);
      return isBuffer(result) ? Buffer.from(result) : result;
    } catch { }
  }

  async set(name, data) {
    try {
      if (typeof data === "undefined") return await this.delete(name);
      await fs.writeFile(this.#key(name), JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  async clear() {
    try {
      const pathname = this.path;
      for (const name of await fs.readdir(pathname)) {
        await fs.unlink(path.join(pathname, name));
      }
      return true;
    } catch {
      return false;
    }
  }

  async delete(name) {
    try {
      await fs.unlink(this.#key(name));
      return true;
    } catch {
      return false;
    }
  }

  async has(name) {
    try {
      await fs.access(this.#key(name));
      return true;
    } catch {
      return false;
    }
  }

  [Symbol.asyncIterator]() {
    let i = 0;
    const path = this.path;
    const getter = this.get.bind(this);
    let names = null;
    return {
      async next() {
        names ??= await fs.readdir(path);
        return new Promise(resolve => {
          const name = names[i++];
          if (!name) return void resolve({ value: null, done: true });
          const key = cutExt(name);
          getter(key)
            .then(value => void resolve({ value: [key, value], done: false }))
            .catch(() => void resolve({ value: null, done: false }));
        });
      }
    };
  }

  async *entries() {
    for await (const i of this) yield i;
  }

  async *values() {
    for await (const entries of this) {
      yield entries[1];
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
    return fs.readdir(this.path)
      .then(x => x.length, () => 0);
  }

  static async truncate() {
    try {
      await setTimeout(0, instances.forEach(async instance =>
        void await instance.clear()));
      return true;
    } catch {
      return false;
    }
  }

  static async destroy() {
    try {
      await FileStorage.truncate();
      for (const [_, { path }] of instances) await fs.rmdir(path);
      await fs.rmdir(settings.warehouse);
      instances.clear();
      return true;
    } catch {
      return false;
    }
  }

  static location(dist) {
    settings._location = dist;
    settings._created = true;
    createFolder(settings.warehouse);
  }
};

module.exports = FileStorage;
