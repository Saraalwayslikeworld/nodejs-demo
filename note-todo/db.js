const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const p = require("path");
const fs = require("fs");
const dbPath = p.join(home, ".todo");

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        if (err) reject(err);
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(content, path = dbPath) {
    return new Promise((resolve, reject) => {
      const str = JSON.stringify(content);
      fs.writeFile(path, str, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  },
};

module.exports = db;
