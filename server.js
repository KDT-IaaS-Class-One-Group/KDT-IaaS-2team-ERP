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
  user: "yuan",
  password: "1234",
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

  server.get('/api/classroom', async (req, res) => {
    try {
      const classrooms = await db.query('SELECT * from classrooms');
      
      // console.log('Classrooms data from the server:', classrooms);
  
      res.json(classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.get('/api/users', async (req, res) => {
    try {
      const users = await db.query('SELECT * from users');
      
      // console.log('Classrooms data from the server:', users);
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

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

        const [rows, fields] = await db.query(
          `INSERT INTO users (userId, password, name, birthdate, phoneNumber, email, address, gender, cash, joinDate, isWithdrawn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, password, name, new Date(birthdate), phoneNumber, email, address, gender, cash, joinDate, isWithdrawn]
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

server.post("/api/admin/login", async (req, res) => {
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
  
  server.post('/api/approveUser/:userId', async (req, res) => {
    try {
      if (req.method === 'POST') {
        const { userId } = req.params;
  
        // 데이터베이스에서 사용자 정보 삭제
        const [result] = await db.query(
          'DELETE FROM users WHERE userId = ?',
          [userId]
        );
  
        if (result.affectedRows === 1) {
          // 성공적으로 삭제된 경우
          res.status(200).json({ message: '사용자 승인 성공' });
        } else {
          // 삭제 실패 시
          res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: '허용되지 않은 메서드' });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.post('/api/approveUser/:inputValue', async (req, res) => {
    try {
      if (req.method === 'POST') {
        const { cash, userId } = req.params;
  
        // 데이터베이스에서 사용자 캐쉬 정보 수정
        const [result] = await db.query(
          'UPDATE users SET cash = ? WHERE userId = ?',
          [cash, userId]
        );
  
        if (result.affectedRows === 1) {
          // 성공적으로 삭제된 경우
          res.status(200).json({ message: '사용자 캐쉬 정보 수정 성공' });
        } else {
          // 삭제 실패 시
          res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: '허용되지 않은 메서드' });
      }
    } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  
  
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});