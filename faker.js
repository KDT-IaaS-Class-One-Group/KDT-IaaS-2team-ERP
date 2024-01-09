//! Users 테이블 가데이터 만드는 faker입니다.
//! README의 Users 쿼리문으로 테이블 만들고
//! 터미널에 faker.js 실행 후 localhost:3001 접속하면 됩니다.

const express = require('express');
const mysql = require('mysql2');
const faker = require('faker');

const app = express();
const port = 3001;

// MariaDB 연결 정보 설정
const db_config = {
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'erp',
  port: 3307
};

// MariaDB 연결
const connection = mysql.createConnection(db_config);
console.log('데이터베이스 연결 성공');

// Express 미들웨어 설정
app.use(express.json());

// 더미 데이터 생성 및 데이터베이스에 삽입
app.get('/', async (req, res) => {
  for (let i = 0; i < 1000; i++) {
    const id = faker.internet.userName();
    const password = 'hashed_password'; // 암호화된 비밀번호로 교체 필요
    const name = faker.name.findName();
    const birth = faker.date.between('1950-01-01', '2004-01-01').toISOString().split('T')[0].replace(/-/g, '');
    const phone = faker.phone.phoneNumber().slice(0, 16); // 최대 16자로 제한
    const email = faker.internet.email();
    const address = faker.address.streetAddress();
    const gender = faker.random.arrayElement(['M', 'F']);
    const cash = faker.datatype.number({ min: 50000, max: 150000 });
    const signout = 'N';
    const admin = 0;
    const RegiMethod = 1;
    const timestamp = faker.date.between('2022-01-01T00:00:00', '2023-12-31T23:59:59').toISOString().slice(0, 19).replace('T', ' ');

    // 쿼리 실행
    const query = `INSERT INTO Users (userId, password, name, birth, phone, email, address, gender, cash, signout, admin, RegiMethod, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [id, password, name, birth, phone, email, address, gender, cash, signout, admin, RegiMethod, timestamp];

    try {
      await connection.execute(query, values);
      console.log('쿼리 실행 성공');
    } catch (err) {
      console.error('쿼리 실행 실패:', err);
    }
  }

  res.send('더미 데이터가 성공적으로 삽입되었습니다.');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});