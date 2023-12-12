import express from "express";
import { router } from "./routes.mjs";
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 8000;

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

// 라우트 등록
app.use("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Server err : ", err);
  } else {
    console.log(`Server running : http://localhost:${PORT}`);
  }
});
