const db = require("../db.js");
const fs = require("fs");
jest.mock("fs");

describe("db", () => {
  it("can read", async () => {
    const data = [{ name: "hi", done: true }];
    fs._setReadMock("/xxx", null, JSON.stringify(data));
    const list = await db.read("/xxx");
    expect(list).toStrictEqual(data);
  });
  it("can write", async () => {
    let fakeFile = "";
    fs._setWriteMock("/yyy", (_path, data, cb) => {
      fakeFile = data;
      cb();
    });
    const data = [{ name: "hi", done: true }];
    await db.write(data, "/yyy");
    expect(fakeFile).toBe(JSON.stringify(data));
  });
});
