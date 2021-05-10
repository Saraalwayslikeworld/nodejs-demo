import * as http from "http";
import * as fs from "fs";
import * as p from "path";
import * as url from "url";
import { IncomingMessage, ServerResponse } from "http";
const server = http.createServer();

const publicDir = p.resolve(__dirname, "public");
server.on("request", (request: IncomingMessage, response: ServerResponse) => {
  const { url: path, method } = request;
  if (method !== "GET") {
    response.statusCode = 405;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("无法处理非get请求");
    return;
  }

  const { pathname } = url.parse(path);
  let fileName = pathname.substr(1);
  if (fileName === "") {
    fileName = "index.html";
  }
  fs.readFile(p.resolve(publicDir, fileName), (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.readFile(p.resolve(publicDir, "404.html"), (err, data) => {
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(data);
        });
      } else if (err.code === "EISDIR") {
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.statusCode = 403;
        response.end("无权查看文件夹");
      } else {
        response.setHeader("Content-Type", "text/plain; charset=utf-8");
        response.statusCode = 500;
        response.end("服务器繁忙，请稍后再试");
      }
    } else {
      response.setHeader("Cache-Control", "public, max-age=31536000");
      response.end(data);
    }
  });
});

server.listen(8888);

// todo 命令行输入参数
