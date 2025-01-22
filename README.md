# Naughty Storage
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NaughtySora/naughty-storage/blob/master/LICENSE)
[![snyk](https://snyk.io/test/github/NaughtySora/naughty-storage/badge.svg)](https://snyk.io/test/github/NaughtySora/naughty-storage)

## Usage
- Install: `npm install naughty-storage`
- Require: `const utils = require('naughty-storage')`

## Storages implement Map interface with async contract

- Initial purpose to use different storages like - memory, file, and more to replace dependency in your project.
- Also can be useful for convenient access to file system and much more.

### pick - choose callback last err first contract function to put result into storage 

```js
const saver = new storage.File("collection");
await saver.pick("key", fs.readFile, "./path");
const output = await saver.get("key");
```

### get/set
```js
const saver = new storage.File("collection");
await saver.set("key", "some valuable string");
const data = await saver.get("key");
```

### delete
```js 
const saver = new storage.Memory("collection");
await saver.set("key", { greet: "hello" });
await saver.delete("key"); // boolean
```

### iteration
```js 
const saver = storage.File("collection");
await saver.set("key", {a: 1});
await saver.set("key-1", {b: 2});
await saver.set("key-2", {c: 3});

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
