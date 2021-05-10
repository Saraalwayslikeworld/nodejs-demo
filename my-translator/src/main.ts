import { appid, appSecret } from "./private";
import * as https from "https";
import * as querystring from "querystring";
const md5 = require("md5");

export const translate = (word: string): void => {
  const salt = Math.random();
  const sign = md5(appid + word + salt + appSecret);
  let from: string, to: string;
  if (/[a-zA-z]/.test(word[0])) {
    from = "en";
    to = "zh";
  } else {
    from = "zh";
    to = "en";
  }
  const query = querystring.stringify({
    q: word,
    from,
    to,
    salt,
    appid,
    sign,
  });
  const options = {
    hostname: "fanyi-api.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET",
  };
  const request = https.request(options, (response) => {
    const chunks: any[] = [];
    response.on("data", (chunk) => {
      chunks.push(chunk);
    });
    response.on("end", () => {
      const data = Buffer.concat(chunks).toString();
      const obj: Result = JSON.parse(data);
      if (obj.error_code) {
        console.error(errorMap[obj.error_code] || "服务器繁忙");
      } else {
        console.log(obj.trans_result.map((item) => item.dst).join("\n"));
      }
    });
  });
  request.on("error", (e) => {
    console.error(e);
  });
  request.end();
};

const errorMap: { [k: string]: string } = {
  "52001": "请求超时, 请重试",
  "52002": "系统错误, 请重试",
  "52003": "未授权用户, 请检查您的appid是否正确，或者服务是否开通",
  "54000": "必填参数为空, 请检查是否少传参数",
  "54001": "签名错误",
  "54003": "访问频率受限, 请降低您的调用频率",
  "54004": "账户余额不足",
  "54005": "长query请求频繁, 请降低长query的发送频率，3s后再试",
  "58000": "客户端IP非法",
  "58001": "译文语言方向不支持",
  "58002": "服务当前已关闭",
  "90107": "认证未通过或未生效",
};
interface TransResult {
  src: string;
  dst: string;
}
interface Result {
  from: string;
  to: string;
  trans_result: TransResult[];
  error_code: string;
  error_msg: string;
}
