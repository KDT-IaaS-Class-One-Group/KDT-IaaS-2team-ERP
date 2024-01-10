const express = require('express');
const mysql = require('mysql2');
const faker = require('faker');

const app = express();
const port = 3001;

// 대한민국의 시와 도 목록
const koreanCities = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
];

// MariaDB 연결 정보 설정
const db_config = {
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'erp',
  port: 3306
};

// MariaDB 연결
const connection = mysql.createConnection(db_config);
console.log('데이터베이스 연결 성공');

// Express 미들웨어 설정
app.use(express.json());

// 더미 데이터 생성 및 데이터베이스에 삽입
app.get('/', async (req, res) => {
  for (let i = 0; i < 1000; i++) {
    const subs_index = faker.datatype.number({ min: 1, max: 100 });
    const user_Index = faker.datatype.number({ min: 1, max: 100 });
    const Subs_Start = faker.date.past().toISOString().slice(0, 19).replace('T', ' ');
    const Subs_End = faker.date.future().toISOString().slice(0, 19).replace('T', ' ');
    const order_name = faker.name.findName();
    const order_phone = faker.phone.phoneNumber().slice(0, 15);

    // 랜덤으로 시와 도 선택
    const randomCity = faker.random.arrayElement(koreanCities);
    
    // 주소에 선택된 시와 도를 포함
    const addressNumber = faker.datatype.number({ min: 1, max: 1000 }); // 1부터 1000 사이의 임의의 숫자
    const address = `${randomCity} ${addressNumber}번길`;

    // 최대 6자리 숫자로 제한
    const zip_code = faker.datatype.number({ min: 100000, max: 999999 }).toString();
    
    const auto_renew = faker.datatype.boolean() ? 1 : 0;
    const staus = faker.datatype.number({ min: 0, max: 3 });

    // 쿼리 실행
    const query = `INSERT INTO orderdetails (subs_index, user_Index, Subs_Start, Subs_End, order_name, order_phone, address, zip_code, auto_renew, staus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [subs_index, user_Index, Subs_Start, Subs_End, order_name, order_phone, address, zip_code, auto_renew, staus];

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
