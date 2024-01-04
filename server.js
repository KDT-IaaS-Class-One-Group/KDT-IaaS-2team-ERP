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

  server.get('/api/classroom', async (req, res) => {
    try {
      const classrooms = await db.query('SELECT * from classrooms');
      
      console.log('Classrooms data from the server:', classrooms);
  
      res.json(classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.get('/api/users', async (req, res) => {
    try {
      const users = await db.query('SELECT * from users');
      
      console.log('Classrooms data from the server:', users);
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.get('/api/signup/checkDuplicate/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const [rows] = await db.query('SELECT * FROM users WHERE userId = ?', [userId]);
  
      if (rows.length > 0) {
        // 이미 존재하는 ID인 경우
        res.json({ isDuplicate: true });
      } else {
        // 존재하지 않는 ID인 경우
        res.json({ isDuplicate: false });
      }
    } catch (error) {
      console.error('Error checking duplicate:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  /** 
  * ! 상품페이지 앤드포인트
  */

  server.get('/api/data', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT name, price, week FROM subscription');
      const dataFromDB = rows.map((row) => ({
        name: row.name,
        price: row.price,
        week: row.week,
      }));
      res.json(dataFromDB);
    } catch (error) {
      console.error('쿼리 실행 중 오류 발생:', error);
      res.status(500).send('데이터베이스 오류');
    }
  });

  /**
   * ! 끝
   */



  // server.get('/api/userinfo', async (req, res) => {
  //   try {
  //     const token = req.headers.authorization?.replace('Bearer ', '');

  //     console.log('전송된 토큰:', token);
      
  
  //     if (!token) {
  //       return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
  //     }
  
  //     const decodedToken = jwt.verify(token, secretKey);
  //     console.log('Token from client:', token);
  //     console.log('Decoded Token:', decodedToken);

  //     if (!decodedToken) {
  //       throw new JsonWebTokenError('jwt malformed');
  //     }
  
  //     if (decodedToken && decodedToken.exp < Date.now()) {
  //       return res.status(401).json({ error: '토큰이 만료되었습니다.' });
  //     }
  //     console.log('Decoded Token:', decodedToken);

  //      // 토큰을 검증하고 사용자 정보 가져오기
  //      const userId = decodedToken.userId;
  
  //     const [rows, fields] = await db.query(
  //       'SELECT userId, name, birthdate, phoneNumber, email, address, gender, cash, FROM users WHERE userId = ?',
  //       [userId]
  //     );
  
  //     if (rows.length === 1) {
  //       const userInfo = rows[0];
  //       res.status(200).json(userInfo);
  //     } else {
  //       res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user info:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

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

        if (user.isWithdrawn) {
          // 회원이 탈퇴한 경우
          res.status(401).json({ error: '이미 탈퇴한 회원입니다.' });
        } else if (password === user.password) {
          // 로그인 성공
          const token = jwt.sign(
            {
              userId,
              name: user.name,
              birthdate: user.birthdate,
              phoneNumber: user.phoneNumber,
              email: user.email,
              address: user.address,
              gender: user.gender,
              cash: user.cash,
            },
            secretKey,
            { expiresIn: '1h' }
          );

          const verified = jwt.verify(token, secretKey);
          console.log(verified);
          console.log('토큰 정보:', token);
          console.log('시크릿 키:', secretKey);

          res.status(200).json({ token });
        } else {
          // 비밀번호 불일치
          res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
      } else {
        // 사용자를 찾을 수 없음
        res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
    } else {
      // 허용되지 않은 메서드
      res.status(405).json({ error: '허용되지 않은 메서드' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 에러' });
  }
});
  
  server.post('/api/insertData', async (req, res) => {
    try {
      const rooms = req.body;
  
      for (const roomKey of Object.keys(rooms)) {
        const room = rooms[roomKey];
        const { instructor, field, computers, students } = room;
  
        await pool.execute(
          'INSERT INTO classrooms (room_id, instructor, field, computers, students) VALUES (?, ?, ?, ?, ?)',
          [roomKey, instructor, field, computers, JSON.stringify(students)]
        );
      }
  
      res.json({ message: '데이터 삽입 성공' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });

  // ...

server.put('/api/updateUser', async (req, res) => {
  try {
    if (req.method === 'PUT') {
      // 인증된 사용자인지 확인
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        console.error('토큰이 제공되지 않았습니다.');
        return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
      }

      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken) {
        console.error('토큰이 유효하지 않습니다.');
        throw new JsonWebTokenError('jwt malformed');
      }


      const userId = decodedToken.userId;

      // 클라이언트에서 보낸 업데이트할 사용자 정보
      const { name, birthdate, phoneNumber, email, address, gender } = req.body;

      // 데이터베이스에서 사용자 정보 업데이트
      const [result] = await db.query(
        'UPDATE users SET name = ?, birthdate = ?, phoneNumber = ?, email = ?, address = ?, gender = ? WHERE userId = ?',
        [name, new Date(birthdate), phoneNumber, email, address, gender, userId]
      );

      if (result.affectedRows === 1) {
        // 업데이트 성공 시 새로운 토큰 발급
        const newToken = jwt.sign(
          {
            userId,
            name,
            birthdate,
            phoneNumber,
            email,
            address,
            gender,
            cash: decodedToken.cash, // 이 부분은 사용자 정보에 따라 추가 또는 수정해야 할 수 있습니다.
          },
          secretKey,
          { expiresIn: '1h' }
        );
        const newDecodedToken = jwt.verify(newToken, secretKey);
        console.log(newDecodedToken);
        res.status(200).json({ token: newToken });
      } else {
        console.error('사용자를 찾을 수 없습니다.');
        res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
    } else {
      console.error('허용되지 않은 메서드');
      res.status(405).json({ error: '허용되지 않은 메서드' });
    }
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.post('/api/refreshToken', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new JsonWebTokenError('jwt malformed');
    }
    console.log('Current Token Info:', decodedToken);

    // 현재 토큰의 정보를 기반으로 새로운 토큰을 발급
    const newToken = jwt.sign(
      {
        userId: decodedToken.userId,
        name: decodedToken.name,
        birthdate: decodedToken.birthdate,
        phoneNumber: decodedToken.phoneNumber,
        email: decodedToken.email,
        address: decodedToken.address,
        gender: decodedToken.gender,
        cash: decodedToken.cash,
      },
      secretKey,
      { expiresIn: '1h' } // 원하는 만료 시간 설정
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.post('/api/withdraw', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new JsonWebTokenError('jwt malformed');
    }

    const userId = decodedToken.userId;

    // 데이터베이스에서 isWithdrawn 상태를 true로 변경
    const [result] = await db.query(
      'UPDATE users SET isWithdrawn = true WHERE userId = ?',
      [userId]
    );

    if (result.affectedRows === 1) {
      // 성공적으로 업데이트된 경우
      res.status(200).json({ message: '회원 탈퇴 성공' });
    } else {
      // 업데이트 실패 시
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error withdrawing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  const PORT = process.env.PORT || 3001;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});