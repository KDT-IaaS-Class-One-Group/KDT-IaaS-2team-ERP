const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const dev = process.env.NODE_ENV !== 'production';
const jwt = require('jsonwebtoken'); 
const app = next({ dev });
const handle = app.getRequestHandler();
const mysql = require('mysql2/promise');

const secretKey = 'nts9604';
const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "723546",
  database: "erp",
  connectionLimit: 5,
});

pool.getConnection()
  .then((conn) => {
    console.log('데이터베이스 연결 성공');
    conn.release();
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err.message);
  });


app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  // 기본적인 Next.js 페이지 핸들링
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const db = pool;
  
  server.post('/api/signup/signup', async (req, res) => {
    try {
      if (req.method === 'POST') {
        const { userId, password, name, birthdate, phoneNumber, email, address, gender } = req.body;

        const cash = 1000000;
        const joinDate = new Date();
        const isWithdrawn = false;
        const isAdmin = false;

        const [rows, fields] = await db.query(
          `INSERT INTO users (userId, password, name, birthdate, phoneNumber, email, address, gender, cash, joinDate, isWithdrawn, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, password, name, new Date(birthdate), phoneNumber, email, address, gender, cash, joinDate, isWithdrawn, isAdmin]
        );
  

        res.status(200).json({ message: '회원가입 성공' });
      } else {
        res.status(405).json({ error: '허용되지 않은 메서드' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 에러' });
    }
  });

  server.post('/api/login', async (req, res) => {
    try {
      if (req.method === 'POST') {
        const { userId, password } = req.body;
  
        const [rows, fields] = await db.query(
          'SELECT * FROM users WHERE userId = ?',
          [userId]
        );
  
        if (rows.length === 1) {
          const user = rows[0];
  
          if (password === user.password) {

            const token = jwt.sign({ userId, name: user.name }, secretKey, { expiresIn: '1h' });
            res.status(200).json({ token });
          } else {
            res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
          }
        } else {
          res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
      } else {
        res.status(405).json({ error: '허용되지 않은 메서드' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '서버 에러' });
    }
  });
  

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});