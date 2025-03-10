# Naughty Storage
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NaughtySora/naughty-storage/blob/master/LICENSE)
[![snyk](https://snyk.io/test/github/NaughtySora/naughty-storage/badge.svg)](https://snyk.io/test/github/NaughtySora/naughty-storage)
[![npm version](https://badge.fury.io/js/naughty-storage.svg)](https://badge.fury.io/js/naughty-storage)
[![NPM Downloads](https://img.shields.io/npm/dm/naughty-storage)](https://www.npmjs.com/package/naughty-storage)
[![NPM Downloads](https://img.shields.io/npm/dt/naughty-storage)](https://www.npmjs.com/package/naughty-storage)

## Usage
- Install: `npm install naughty-storage`
- Require: `const utils = require('naughty-storage')`


## Storages implement Map interface with async contract

- Initial purpose to use different storages like - memory, file, and more to replace dependency in your project.
- Also can be useful for convenient access to file system and much more.
- Intially FileStorage **saves data into root package folder (node_modules)**, to change this use File.location(path) static method in root project file

### change FileStorage root storage location
```js

const main = () => {
  //root project file
  FileStorage.location("./");
  await startDB();
  await startSomeServer();
};
```

### pick - choose callback last err first contract function to put result into storage 

```js
const storage = new FileStorage("collection");
await storage.pick("key", fs.readFile, "./path");
const output = await storage.get("key");
```

### get/set
```js
const storage = new FileStorage("collection");
await storage.set("key", "some valuable string");
const data = await storage.get("key");
```

### delete
```js 
const storage = new MemoryStorage("collection");
await storage.set("key", { greet: "hello" });
await storage.delete("key"); // boolean
```

### iteration
```js 
const storage = FileStorage("collection");
await storage.set("key", {a: 1});
await storage.set("key-1", {b: 2});
await storage.set("key-2", {c: 3});

for await (const entry of storage) {
  // ["key", {a: 1}]
  // ["key-1", {b: 2}]
  // ["key-2", {c: 3}]
}

for await (const key of storage.keys()) {
  // "key"
  // "key-1"
  // "key-2"
}

for await (const value of storage.values()) {
  // {a: 1}
  // {b: 2}
  // {c: 3}
}
```

## Part of naughty stack
