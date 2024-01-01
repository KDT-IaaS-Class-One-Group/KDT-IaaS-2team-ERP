const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

  const server = express();
  server.use(bodyParser.json());

  // 기본적인 Next.js 페이지 핸들링
  app.get('*', (req, res) => {
    return handle(req, res);
  });

app.post('/api/login', async (req, res) => {
    if (req.method === 'POST') {
      const { userId, password } = req.body;

      if (userId === "admin" && password === "1234") {
        const token = jwt.sign({ userId, name: user.name }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token: "my-secret-token" });
      } else {
        res.status(401).json({ error: "invalid credentials" });
      }
    }
})

app.listen(3000, () => console.log("Server started at http://localhost:3000"));