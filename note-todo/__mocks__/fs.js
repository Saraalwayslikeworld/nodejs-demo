const fs = jest.createMockFromModule("fs");
const _fs = jest.requireActual("fs");
Object.assign(fs, _fs);

const readMockFiles = Object.create(null);
function _setReadMock(path, error, data) {
  readMockFiles[path] = [error, data];
}
fs.readFile = (path, options, callback) => {
  if (callback === undefined) {
    callback = options;
  }
  if (path in readMockFiles) {
    callback(...readMockFiles[path]);
  } else {
    _fs.readFile(path, options, callback);
  }
};

const writeMockFiles = Object.create(null);
function _setWriteMock(path, cb) {
  writeMockFiles[path] = cb;
}
fs.writeFile = (path, data, options, callback) => {
  if (callback === undefined) {
    callback = options;
  }
  if (path in writeMockFiles) {
    writeMockFiles[path](path, data, options, callback);
  } else {
    _fs.writeFile(path, data, options, callback);
  }
};

fs._setWriteMock = _setWriteMock;
fs._setReadMock = _setReadMock;

module.exports = fs;
