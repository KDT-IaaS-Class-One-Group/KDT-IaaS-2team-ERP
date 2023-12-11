import express from "express";
import fs from "fs/promises"; // Promise 기반의 fs 모듈
import session from "express-session";
import path from "path";
import { pool } from "./data/db-config.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { insertRecords } from "./data/signup-db.mjs";
import { readJsonFile } from "./data/readJsonFile.mjs";


const router = express.Router();
const signupJsonFile = new URL("./data/signUp.json", import.meta.url).pathname;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sessionConfig = {
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if your server is using https
};

router.use(session(sessionConfig));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 세션은 사용자가 로그인한 후 서버에 의해 유지되는 데이터 저장 공간
// 로그인 세션 확인
router.get("/check-session", (req, res) => {
  if (req.session && req.session.user) {
    // 세션이 있는 경우, 세션은 유효하다고 응답
    res.status(200).send("세션 유효");
  } else {
    // 세션이 없는 경우, 세션이 유효하지 않다고 응답
    res.status(401).send("세션 유효하지 않음");
  }
});

// Serve index.html
router.get("/", async (req, res) => {
  try {
    // index.html 파일의 절대 경로
    const indexPath = path.resolve(__dirname, "./public/index.html");
    // fs/promises 모듈을 사용하여 파일을 읽어오는 비동기 코드
    const indexData = await fs.readFile(indexPath, "utf-8");
    // 클라이언트에 읽은 파일 데이터를 응답
    res.send(indexData);
  } catch (error) {
    console.error("Error reading index.html:", error);
    res.status(500).send("Internal Server Error");
  }
});

// login 요청
router.post("/login", async (req, res) => {
  try {
    const { signupId, signupPassword } = req.body;
    const selectQuery = "SELECT * FROM users WHERE signupId = ?";
    const [results] = await pool.query(selectQuery, [signupId]);

    if (results.length > 0) {
      const user = results[0];
      // 비밀번호를 암호화하여 저장되어 있는 비밀번호와 비교
      if (signupPassword === user.signupPassword) {
        req.session.user = { id: signupId };
        console.log("User logged in:", req.session.user);
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid login credentials");
      }
    } else {
      res.status(401).send("Invalid login credentials");
    }
  } catch (error) {
    handleError(res, error);
  }
});

// logout 요청
router.get("/logout", (req, res) => {
  // 현재 세션을 파괴하는 메서드
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // 클라이언트에게 응답을 보내기 전에 세션 쿠키를 클리어
      res.clearCookie("connect.sid");
      res.status(200).send("Logout successful");
    }
  });
});

// sign up Form
router.post("/signup", async (req, res) => {
  try {
    // POST 요청에서 속성 : id, password, email을 추출을 위한 비구조화 할당
    const { signupId, signupPassword, email } = req.body;
    // timestamp를 MySQL datetime 형식('YYYY-MM-DD HH:mm:ss')으로 변환
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\.\d+Z$/, "");
    // signUp.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile("./data/signUp.json", "utf-8");
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      signupId: signupId,
      signupPassword: signupPassword,
      email: email,
      timestamp: timestamp,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile("./data/signUp.json", JSON.stringify(formData, null, 2));

    const jsonData = await readJsonFile(signupJsonFile);
    // jsonData에 inputRecords가 존재하지 않을 경우에는 빈 배열([])
    const inputRecords = jsonData.inputRecords || [];

    await insertRecords(inputRecords);

    // 성공 응답 클라이언트에 전송
    res.json({
      status: "success",
      formData: {
        signupId: signupId,
        signupPassword: signupPassword,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error handling signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function checkIdDuplicate(signupId) {
  const selectQuery = "SELECT COUNT(*) as count FROM users WHERE signupId = ?";
  // 비구조화 할당
  // pool.query 함수의 결과로 반환되는 배열의 첫 번째 요소를 result 변수에 할당
  // selectQuery로 정의된 쿼리를 실행하고, 그 중에서 signupId 값이 일치하는 데이터를 검색하는 역할
  const [result] = await pool.query(selectQuery, [signupId]);

  // 결과에서 중복 여부 확인
  const isDuplicate = result[0].count > 0;
  return isDuplicate;
}

router.post("/check-id-duplicate", async (req, res) => {
  try {
    const { signupId } = req.body;

    // 중복 여부 확인 함수 호출
    const isIdDuplicate = await checkIdDuplicate(signupId);

    // 클라이언트에 응답
    res.json({ isIdDuplicate });
  } catch (error) {
    console.error("Error checking ID duplicate:", error);
    res.status(500).send("Internal Server Error");
  }
});

export { router };