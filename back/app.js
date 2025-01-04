const express = require("express");
const dotenv = require("dotenv");
const http = require("http"); // HTTP 서버 모듈 추가

dotenv.config();

async function startServer() {
  const app = express();

  // HTTP 서버 생성 (Express 앱 기반)
  const server = http.createServer(app);

  // server,app -> loaders
  await require(".")(app,server);

  // 서버 리스닝 시작
  server
    .listen(3000, () => {
      console.log(`
      ################################################
      🛡️  서버 온 : ${app.get("port")} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
}
startServer();
