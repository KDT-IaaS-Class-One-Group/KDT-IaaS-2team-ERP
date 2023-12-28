const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const jwt = require("jsonwebtoken");
const handle = app.getRequestHandler();
const secretKey = "nts123";

app.prepare().then(()=> {

const server = express();
server.use(bodyParser.json());

// 기본적인 Next.js 페이지 핸들링
server.get("*", (req, res) => {
  return handle(req, res);
});

server.post("/api/login", async (req, res) => {
  if (req.method === "POST") {
    const { userId, password } = req.body;
    console.log(req.body);
    if (userId === "admin" && password === "1234") {
      const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token: "my-secret-token" });
    } else {
      res.status(401).json({ error: "invalid credentials" });
    }
  }
});

server.listen(3000, () => console.log("Server started at http://localhost:3000"));
})
// 그니까 이게 원래는 익스프레스 쓸 때 익스프레스 가져온다음에 앱으로 하잖아. 개발서버를 열어야되서 넥스트 개발서버를 해줘서 이렇게 한번 묶고 익스프레스를 서버로 정의해준다