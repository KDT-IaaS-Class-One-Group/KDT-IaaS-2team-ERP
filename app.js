import express from "express";

const app = express();
const PORT = 8000;

// 정적 파일 미들웨어 등록
app.use(express.static("public"));

app.listen(PORT, (err) => {
  if (err) {
    console.error("Server err : ", err);
  } else {
    console.log(`Server running : http://localhost:${PORT}`);
  }
});