const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const dev = process.env.NODE_ENV !== "production";
const jwt = require("jsonwebtoken");
const app = next({ dev });
const handle = app.getRequestHandler();
const mysql = require("mysql2/promise");
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');

const { checkAndRenewSubscriptions } = require("./src/components/checkAndRenewSubscriptions");


const secretKey = "nts9604";
const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "0000",
  database: "erp",
  connectionLimit: 5,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("데이터베이스 연결 성공");
    conn.release();
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err.message);
  });

app.prepare().then(() => {

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // 업로드된 파일이 저장될 경로 (public/uploads 폴더를 사용)
    },
    filename: (req, file, cb) => {
      // 파일 이름 설정 (현재는 'image' + timestamp + 확장자로 설정)
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `image${timestamp}${ext}`);
    },
  });
  
  const upload = multer({ storage });

  const server = express();
  server.use(bodyParser.json());


  // cron.schedule('15 * * * *', async () => {
  //   try {
  //     // 구독을 확인하고 갱신하는 함수 호출
  //     await checkAndRenewSubscriptions();
  //   } catch (error) {
  //     console.error('구독 갱신 오류:', error);
  //   }
  // });

  // async function checkAndRenewSubscriptions() {
  //   const currentDate = new Date();
  
  //   // 구독 갱신이 필요한 주문 조회
  //   const dueSubscriptionsQuery = `
  //     SELECT Order_Index, subs_index, user_Index, Subs_Start, Subs_End
  //     FROM Orderdetails
  //     WHERE Subs_End <= ?;
  //   `;
  
  //   const [dueSubscriptionsResult] = await pool.query(dueSubscriptionsQuery, [currentDate]);
  
  //   for (const subscription of dueSubscriptionsResult) {
  //     const { Order_Index, subs_index, user_Index, Subs_Start, Subs_End } = subscription;
  
  //     // 해당 주문의 구독 주기 조회
  //     const weekQuery = `SELECT Week FROM subscription WHERE subs_index = ?`;
  //     const [weekResult] = await pool.query(weekQuery, [subs_index]);
  
  //     if (weekResult.length > 0) {
  //       const week = weekResult[0].Week;
  
  //       // 새로운 시작일 결정 (예: 이전 구독의 종료일)
  //       const newStartDate = Subs_End;
  
  //       // 새로운 종료일 결정 (예: week * 7일 연장)
  //       const newEndDate = new Date(Subs_End.getTime() + week * 7 * 24 * 60 * 60 * 1000);
  
  //       // 데이터베이스에서 구독 정보 업데이트
  //       const updateSubscriptionQuery = `
  //         UPDATE Orderdetails
  //         SET Subs_Start = ?, Subs_End = ?
  //         WHERE Order_Index = ?;
  //       `;
  
  //       await pool.query(updateSubscriptionQuery, [newStartDate, newEndDate, Order_Index]);
  
  //       // 갱신된 구독에 대한 로그 또는 알림
  //       console.log(`사용자 ${user_Index}의 구독이 갱신되었습니다. 시작일: ${newStartDate}, 종료일: ${newEndDate}`);
  //     }
  //   }
  // }


  cron.schedule("0 * * * *", () => {
    try {
      checkAndRenewSubscriptions(pool); 
      console.log("checkAndRenewSubscriptions.js가 실행되었습니다.");
    } catch (error) {
      console.error(
        "checkAndRenewSubscriptions.js 실행 중 오류가 발생했습니다:",
        error.message
      );
    }
  });

  // // ! 테스트 목적 즉시 실행되게 
  // checkAndRenewSubscriptions(pool); 

  // async function checkAndRenewSubscriptions() {
  //   const currentDate = new Date();
  
  //   // 구독 갱신이 필요한 주문 조회
  //   const dueSubscriptionsQuery = `
  //     SELECT Order_Index, subs_index, user_Index, Subs_Start, Subs_End
  //     FROM Orderdetails
  //     WHERE Subs_End <= ?;
  //   `;
  
  //   const [dueSubscriptionsResult] = await pool.query(dueSubscriptionsQuery, [currentDate]);
  
  //   for (const subscription of dueSubscriptionsResult) {
  //     const { Order_Index, subs_index, user_Index, Subs_Start, Subs_End } = subscription;
  
  //     // 해당 주문의 구독 주기 조회
  //     const weekQuery = `SELECT Week FROM subscription WHERE subs_index = ?`;
  //     const [weekResult] = await pool.query(weekQuery, [subs_index]);
  
  //     if (weekResult.length > 0) {
  //       const week = weekResult[0].Week;
  
  //       // 새로운 시작일 결정 (예: 이전 구독의 종료일)
  //       const newStartDate = Subs_End;
  
  //       // 새로운 종료일 결정 (예: week * 7일 연장)
  //       const newEndDate = new Date(Subs_End.getTime() + week * 7 * 24 * 60 * 60 * 1000);
  
  //       // 데이터베이스에서 구독 정보 업데이트
  //       const updateSubscriptionQuery = `
  //         UPDATE Orderdetails
  //         SET Subs_Start = ?, Subs_End = ?
  //         WHERE Order_Index = ?;
  //       `;
  
  //       await pool.query(updateSubscriptionQuery, [newStartDate, newEndDate, Order_Index]);
  
  //       // 갱신된 구독에 대한 로그 또는 알림
  //       console.log(`사용자 ${user_Index}의 구독이 갱신되었습니다. 시작일: ${newStartDate}, 종료일: ${newEndDate}`);
  //     }
  //   }
  // }


  server.get("/api/classroom", async (req, res) => {
    try {
      const classrooms = await db.query("SELECT * from classrooms");
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get('/api/userGraph', async (req, res) => {
    const { xAxis } = req.query;
  
    try {
      let query;
      switch (xAxis) {
        case 'timestamp':
          query = `
            SELECT DATE_FORMAT(timestamp, '%Y-%m') as label, COUNT(DISTINCT id) as userCount
            FROM User
            GROUP BY label
            ORDER BY label;
          `;
          break;
        case 'birth':
          query = `
            SELECT YEAR(birth) as label, COUNT(DISTINCT id) as userCount
            FROM User
            GROUP BY label
            ORDER BY label;
          `;
          break;
          case 'gender':
            query = `
              SELECT gender as label, COUNT(DISTINCT id) as userCount
              FROM User
              GROUP BY label
              ORDER BY label;
            `;
            break;
        default:
          res.status(400).send('Invalid xAxis parameter');
          return;
      }
  
      const connection = await pool.getConnection();
      const [results] = await connection.query(query);
      connection.release();
  
      res.json(results);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  server.get('/api/users', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
      const pageSize = parseInt(req.query.pageSize) || 10; // 페이지당 항목 수 (기본값: 10)
      const searchTerm = req.query.searchTerm || "";
      const searchOption = req.query.searchOption || "userId";

      let query = "SELECT * FROM users";
      let queryParams = [];

      if (searchTerm) {
        if (searchOption === "userId") {
          query += " WHERE userId LIKE ?";
        } else if (searchOption === "name") {
          query += " WHERE name LIKE ?";
        }
  
        queryParams = [`%${searchTerm}%`];
      }

      query += " LIMIT ?, ?";
      queryParams.push((page - 1) * pageSize, pageSize);

      const [users] = await db.query(query, queryParams);

      let totalCountQuery = "SELECT COUNT(*) AS totalCount FROM users";
      if (searchTerm) {
        if (searchOption === "userId") {
          totalCountQuery += " WHERE userId LIKE ?";
        } else if (searchOption === "name") {
          totalCountQuery += " WHERE name LIKE ?";
        }
      }

      const [totalCount] = await db.query(
        totalCountQuery,
        queryParams.slice(0, 2)
      );
      const totalPages = Math.ceil(totalCount[0].totalCount / pageSize);

      res.json({
        users,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get("/api/users/cash", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const searchTerm = req.query.searchTerm || "";
      const searchOption = req.query.searchOption || "userId";
  
      let query = "SELECT * FROM users";
      let queryParams = [];
  
      if (searchTerm) {
        if (searchOption === "userId") {
          query += " WHERE userId LIKE ?";
        } else if (searchOption === "name") {
          query += " WHERE name LIKE ?";
        }
  
        queryParams = [`%${searchTerm}%`];
      }
  
      query += " LIMIT ?, ?";
      queryParams.push((page - 1) * pageSize, pageSize);
  
      const [users] = await db.query(query, queryParams);
  
      let totalCountQuery = "SELECT COUNT(*) AS totalCount FROM users";
      if (searchTerm) {
        if (searchOption === "userId") {
          totalCountQuery += " WHERE userId LIKE ?";
        } else if (searchOption === "name") {
          totalCountQuery += " WHERE name LIKE ?";
        }
      }
  
      const [totalCount] = await db.query(totalCountQuery, queryParams.slice(0, 1));
      const totalPages = Math.ceil(totalCount[0].totalCount / pageSize);
  
      res.json({
        users,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get('/api/mysubscription', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
  
      if (!token) {
        return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
      }
  
      const decodedToken = jwt.verify(token, secretKey);
  
      if (!decodedToken) {
        throw new JsonWebTokenError('jwt malformed');
      }
      const orderIndex = decodedToken.order_Index;
  
      // orderIndex를 사용하여 orderdetails 테이블에서 subs_index, Subs_Start, Subs_End를 가져오기
      const orderDetailsData = await db.query(
        'SELECT subs_index, Subs_Start, Subs_End FROM orderdetails WHERE order_Index = ?',
        [orderIndex]
      );

      const orderProductdata = await db.query(
        'SELECT product_id FROM orderproduct WHERE order_Index = ?',
        [orderIndex]
      );
      
      // orderProductdata는 여러 행을 포함하는 배열일 것입니다.
      // 각 행에서 product_id 값을 추출하여 배열에 저장합니다.
      const productIds = orderProductdata[0].map((row) => row.product_id);
      
      // productIds 배열을 이용하여 원하는 작업 수행
     
        const productData = await db.query(
          ` SELECT * FROM product WHERE product_id IN (${productIds.join(', ')})`
        )
    
      if (orderDetailsData.length > 0) {
        const { subs_index, Subs_Start, Subs_End } = orderDetailsData[0][0];
        
        // subs_index를 사용하여 subscription 테이블에서 데이터를 가져오기
        const subscriptionData = await db.query(
          'SELECT * FROM subscription WHERE subs_index = ?',
          [subs_index]
        );
        if (subscriptionData.length > 0) {
          // subscriptionData와 orderDetailsData의 Subs_Start, Subs_End 정보를 함께 전송
          res.status(200).json({
            productdata: productData[0],
            subscriptionData: subscriptionData[0][0],
            Subs_Start: Subs_Start.toISOString(),
            Subs_End: Subs_End.toISOString(),
          });
          
          
          
        } else {
          res.status(404).json({ error: '구독 정보를 찾을 수 없습니다.' });
        }
      } else {
        res.status(404).json({ error: 'Order details를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  server.get('/api/signup/checkDuplicate/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;

      const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [
        userId,
      ]);

      if (rows.length > 0) {
        // 이미 존재하는 ID인 경우
        res.json({ isDuplicate: true });
      } else {
        // 존재하지 않는 ID인 경우
        res.json({ isDuplicate: false });
      }
    } catch (error) {
      console.error("Error checking duplicate:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** 
  * ! 구독페이지 앤드포인트
  */

  server.get("/api/data", async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT Subs_Index, name, price, week FROM subscription');
      const dataFromDB = rows.map((row) => ({
        Subs_Index: row.Subs_Index,
        name: row.name,
        price: row.price,
        week: row.week,
      }));
      res.json(dataFromDB);
    } catch (error) {
      console.error("쿼리 실행 중 오류 발생:", error);
      res.status(500).send("데이터베이스 오류");
    }
  });




  /**
   * ! 끝
   */


/** 

  * ! 상품페이지 앤드포인트
  */

  server.get('/api/products', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT product_id , category_id, product_name, stock_quantity , info FROM product');
      const dataFromDB = rows.map((row) => ({
        id: row.product_id,
        category:row.category_id,
        name: row.product_name,
        stock: row.stock_quantity,
        info: row.info
      }));
      res.json(dataFromDB);
    } catch (error) {
      console.error("쿼리 실행 중 오류 발생:", error);
      res.status(500).send("데이터베이스 오류");
    }
  });

  /**
   * ! 끝
   */

  server.get('/api/productss', async (req, res) => {
    try {
      const productIds = req.query.productIds;
      if (!productIds) {
        return res.status(400).json({ error: '상품 ID가 제공되지 않았습니다.' });
      }
  
      const ids = productIds.split(',').map((id) => parseInt(id, 10));
      
      const productsPromises = ids.map(async (id) => {
        const [rows] = await db.query('SELECT product_id, category_id, product_name, stock_quantity, info FROM product WHERE product_id = ?', [id]);
        if (rows.length > 0) {
          const row = rows[0];
          return {
            id: row.product_id,
            category: row.category_id,
            name: row.product_name,
            stock: row.stock_quantity,
            info: row.info
          };
        }
        return null;
      });
  
      const products = await Promise.all(productsPromises);
  
      res.json(products.filter((product) => product !== null));
    } catch (error) {
      console.error('쿼리 실행 중 오류 발생:', error);
      res.status(500).send('데이터베이스 오류');
    }
  });

  /**
 * ? /Order 엔드포인트
 */

server.post("/api/order", async (req, res) => {
  try {
    // 클라이언트로부터 받은 상품 이름
    const { product } = req.body;

    // 클라이언트에서 전송된 토큰
    const token = req.headers.authorization;

    // 토큰이 존재하는지 확인
    if (!token) {
      res.status(401).send("인증되지 않은 사용자입니다.");
      return;
    }

    // 데이터베이스에 삽입할 쿼리문
    const insertQuery = `INSERT INTO cart (Product_Index) VALUES (?)`;

    // 쿼리 실행
    db.query(insertQuery, [product], (error, results) => {
      if (error) {
        console.error("쿼리 실행 오류:", error);
        res.status(500).send("주문 생성 중 오류가 발생했습니다.");
      } else {
        console.log("주문이 성공적으로 생성되었습니다.");
        res.status(200).send("주문이 성공적으로 생성되었습니다.");
      }
    });
  } catch (error) {
    console.error("주문 생성 중 오류:", error);
    res.status(500).send("주문 생성 중 오류가 발생했습니다.");
  }
});

server.post('/api/payment', async (req, res) => {
  try {
    const token = req.body.token;
    const price = req.body.price;
    const subsIndex = req.body.sub_index;
    const ids = req.body.ids;
    const address = req.body.address; // 추가된 부분

    // 토큰 해독
    const decodedToken = jwt.verify(token, secretKey);
    const userIndex = decodedToken.User_Index;


    // 데이터베이스 연결
    const connection = await pool.getConnection();

    try {
      // 트랜잭션 시작
      await connection.beginTransaction();

      // 사용자의 캐시 차감
      const updateCashQuery = `UPDATE users SET cash = cash - ? WHERE user_Index = ?`;
      const updateCashValues = [price, userIndex];
      await connection.query(updateCashQuery, updateCashValues);

      // 주문 정보 추가
      const weekQuery = `SELECT Week FROM subscription WHERE subs_index = ?`;
      const [weekResult] = await connection.query(weekQuery, [subsIndex]);

      const week = weekResult[0].Week;

      // 추가된 부분: 사용자의 user_Index 값으로 주문 정보를 추가
      const orderQuery = `
        INSERT INTO Orderdetails (subs_index, user_Index, price, Subs_Start, Subs_End, address) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const orderValues = [
        subsIndex,
        userIndex, // 추가된 부분
        price,
        new Date(),
        new Date(Date.now() + week * 7 * 24 * 60 * 60 * 1000),
        address,
      ];

      const [orderResult] = await connection.query(orderQuery, orderValues);
      const orderId = orderResult.insertId;

      // ids를 배열로 변환
      const productIds = ids.split(',').map((id) => parseInt(id, 10));

      // users 테이블 구독상탭 변경
      const updateUserOrderIndexQuery = `UPDATE users SET order_Index = ? WHERE user_Index = ?`;
      const updateUserOrderIndexValues = [orderId, userIndex];
      await connection.query(updateUserOrderIndexQuery, updateUserOrderIndexValues);

      // OrderProduct에 추가
      const orderProductQuery = `
        INSERT INTO OrderProduct (Order_Index, product_id)
        VALUES (?, ?)
      `;

      // 각 product_id에 대해 OrderProduct 행 추가
      for (const productId of productIds) {
        const orderProductValues = [orderId, productId];
        await connection.query(orderProductQuery, orderProductValues);
      }

      // 트랜잭션 커밋
      await connection.commit();

      // 연결 해제
      connection.release();

      res.status(200).json({ message: '결제가 완료되었습니다.' });
    } catch (error) {
      // 트랜잭션 롤백
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
});

/**
 * ? 끝
 */

  server.get('/api/subscription/:subs_index', async (req, res) => {
    const {subs_index} = req.params;
    
    
    try {
      const [rows] = await db.execute('SELECT Subs_Index, Name, Price, Week, size FROM subscription WHERE Subs_Index = ?', [subs_index]);
      
      const dataFromDB = rows.map((row) => ({
        Subs_Index: row.Subs_Index,
        Name: row.Name,
        Price: row.Price,
        Week: row.Week,
        size: row.size,
      }));
      res.json(dataFromDB);
    } catch (error) {
      console.error("쿼리 실행 중 오류 발생:", error);
      res.status(500).send("데이터베이스 오류");
    }
  });


  server.get("/api/cash", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
      const pageSize = parseInt(req.query.pageSize) || 10; // 페이지당 항목 수 (기본값: 10)

      const offset = (page - 1) * pageSize;

      const [users] = await db.query("SELECT * FROM users LIMIT ?, ?", [
        offset,
        pageSize,
      ]);
      const [totalCount] = await db.query(
        "SELECT COUNT(*) AS totalCount FROM users"
      );
      const totalPages = Math.ceil(totalCount[0].totalCount / pageSize);

      res.json({
        users,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get("/api/subs-product", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값: 1)
      const pageSize = parseInt(req.query.pageSize) || 10; // 페이지당 항목 수 (기본값: 10)

      const offset = (page - 1) * pageSize;

      const [subs] = await db.query(
        "SELECT * FROM subscription LIMIT ?, ?, ?, ? ",
        [offset, pageSize]
      );
      const [totalCount] = await db.query(
        "SELECT COUNT(*) AS totalCount FROM subscription"
      );
      const totalPages = Math.ceil(totalCount[0].totalCount / pageSize);

      res.json({
        subs,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
        },
      });
      
    } catch (error) {
      console.error("Error fetching subs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get('/customer/getData', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows, fields] = await connection.query('SELECT title, content, password FROM board');

      // 데이터베이스에서 가져온 정보를 클라이언트에게 반환합니다.
      res.json(rows);

      // 연결 해제
      connection.release();
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  // 기본적인 Next.js 페이지 핸들링
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  const db = pool;

  server.post("/api/signup/signup", async (req, res) => {
    try {
      if (req.method === "POST") {
        const {
          userId,
          password,
          name,
          birthdate,
          phoneNumber,
          email,
          address,
          gender,
        } = req.body;

        const cash = 1000000;
        const joinDate = new Date();
        const isWithdrawn = false;

        const [rows, fields] = await db.query(
          `INSERT INTO users (userId, password, name, birthdate, phoneNumber, email, address, gender, cash, joinDate, isWithdrawn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            password,
            name,
            new Date(birthdate),
            phoneNumber,
            email,
            address,
            gender,
            cash,
            joinDate,
            isWithdrawn,
          ]
        );

        res.status(200).json({ message: "회원가입 성공" });
      } else {
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "서버 에러" });
    }
  });

  server.post("/api/admin/login", async (req, res) => {
    if (req.method === "POST") {
      const { userId, password } = req.body;
      if (userId === "admin" && password === "1234") {
        const token = jwt.sign({ userId }, secretKey, {
          expiresIn: "1h",
        });
        res.status(200).json({ token });
        console.log(token);
      } else {
        res.status(401).json({ error: "invalid credentials" });
      }
    }
  });

  server.post("/api/login", async (req, res) => {
    try {
      if (req.method === "POST") {
        const { userId, password } = req.body;

        const [rows, fields] = await db.query(
          "SELECT * FROM users WHERE userId = ?",
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
              User_Index: user.User_Index,
              userId: user.userId ,
              name: user.name,
              birthdate: user.birthdate,
              phoneNumber: user.phoneNumber,
              email: user.email,
              address: user.address,
              gender: user.gender,
              cash: user.cash,
              order_Index:user.order_Index,
            },
            secretKey,
            { expiresIn: '1h' }
          );

          const verified = jwt.verify(token, secretKey);
        
          console.log(token)

            res.status(200).json({ token });
          } else {
            // 비밀번호 불일치
            res
              .status(401)
              .json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
          }
        } else {
          // 사용자를 찾을 수 없음
          res
            .status(401)
            .json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "서버 에러" });
    }
  });

  server.post("/api/approveUser/:userId", async (req, res) => {
    try {
      if (req.method === "POST") {
        const { userId } = req.params;

        // 데이터베이스에서 사용자 정보 삭제
        const [result] = await db.query("DELETE FROM users WHERE userId = ?", [
          userId,
        ]);

        if (result.affectedRows === 1) {
          // 성공적으로 삭제된 경우
          res.status(200).json({ message: "사용자 승인 성공" });
        } else {
          // 삭제 실패 시
          res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.post("/api/insertData", async (req, res) => {
    try {
      if (req.method === "POST") {
        const { userId } = req.params;

        // 데이터베이스에서 사용자 정보 삭제
        const [result] = await db.query("DELETE FROM users WHERE userId = ?", [
          userId,
        ]);

        if (result.affectedRows === 1) {
          // 성공적으로 삭제된 경우
          res.status(200).json({ message: "사용자 승인 성공" });
        } else {
          // 삭제 실패 시
          res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.put("/api/updateCash/:userId", async (req, res) => {
    try {
      if (req.method === "PUT") {
        const { userId } = req.params;
        const { cash } = req.body;
        // 데이터베이스에서 사용자 캐쉬 정보 수정
        const [result] = await db.query(
          "UPDATE users SET cash = ? WHERE userId = ?",
          [cash, userId]
        );

        if (result.affectedRows === 1) {
          // 성공적으로 수정된 경우
          res.status(200).json({ message: "사용자 캐쉬 정보 수정 성공" });
        } else {
          // 삭제 실패 시
          res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
  });

  server.post("/api/subs-product", async (req, res) => {
    try {
      if (req.method === "POST") {
        const { productIndex, name, price, week } = req.body;
        
        // 데이터베이스에서 subscription 정보 추가
        const [result] = await db.query(
          "INSERT INTO subscription (product_Index, name, price, week) VALUES (?, ?, ?, ?)",
          [productIndex, name, price, week]
        );
  
        if (result.affectedRows === 1) {
          // 성공적으로 추가된 경우
          res.status(200).json({ message: "subscription 정보 추가 성공" });
        } else {
          // 추가 실패
          res.status(500).json({ error: "subscription 정보 추가 실패" });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '내부 서버 오류' });
    }
  });

  server.post("/api/addproduct", async (req, res) => {
    try {
      if (req.method === "POST") {
        const {category_id,
        product_name,
        stock_quantity,
        info,} = req.body;
        
        // 데이터베이스에서 subscription 정보 추가
        const [result] = await db.query(
          "INSERT INTO product (category_id, product_name, stock_quantity , info) VALUES (?, ?, ?, ?)",
          [category_id, product_name, stock_quantity, info]
        );

        if (result.affectedRows === 1) {
          // 성공적으로 추가된 경우
          res.status(200).json({ message: "subscription 정보 추가 성공" });
        } else {
          // 추가 실패
          res.status(500).json({ error: "subscription 정보 추가 실패" });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
  });

  // ...

  server.put("/api/updateUser", async (req, res) => {
    try {
      if (req.method === "PUT") {
        // 인증된 사용자인지 확인
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          console.error("토큰이 제공되지 않았습니다.");
          return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
        }

        const decodedToken = jwt.verify(token, secretKey);
        if (!decodedToken) {
          console.error("토큰이 유효하지 않습니다.");
          throw new JsonWebTokenError("jwt malformed");
        }

        const userId = decodedToken.userId;

        // 클라이언트에서 보낸 업데이트할 사용자 정보
        const { name, birthdate, phoneNumber, email, address, gender } =
          req.body;

        // 데이터베이스에서 사용자 정보 업데이트
        const [result] = await db.query(
          "UPDATE users SET name = ?, birthdate = ?, phoneNumber = ?, email = ?, address = ?, gender = ? WHERE userId = ?",
          [
            name,
            new Date(birthdate),
            phoneNumber,
            email,
            address,
            gender,
            userId,
          ]
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
            { expiresIn: "1h" }
          );
          const newDecodedToken = jwt.verify(newToken, secretKey);
          console.log(newDecodedToken);
          res.status(200).json({ token: newToken });
        } else {
          console.error("사용자를 찾을 수 없습니다.");
          res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }
      } else {
        console.error("허용되지 않은 메서드");
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.post("/api/refreshToken", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
      }

      const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      throw new JsonWebTokenError('jwt malformed');
    }
    

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
        { expiresIn: "1h" } // 원하는 만료 시간 설정
      );

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.post('/api/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh 토큰이 제공되지 않았습니다.' });
    }

    const decodedRefreshToken = jwt.verify(refreshToken, secretKey);

    if (!decodedRefreshToken) {
      throw new Error('Refresh 토큰이 유효하지 않습니다.');
    }

    // 여기에서 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign(
      {
        user_Index:decodedRefreshToken.user_Index ,
        userId: decodedRefreshToken.userId,
        name: decodedRefreshToken.name,
        birthdate: decodedRefreshToken.birthdate,
        phoneNumber: decodedRefreshToken.phoneNumber,
        email: decodedRefreshToken.email,
        address: decodedRefreshToken.address,
        gender: decodedRefreshToken.gender,
        cash: decodedRefreshToken.cash,
        order_Index:decodedRefreshToken.order_Index,
      },
      secretKey,
      { expiresIn: '1h' } // 원하는 만료 시간 설정
    );

    res.status(200).json({ newAccessToken });
  } catch (error) {
    console.error('Refresh 토큰 갱신 중 오류 발생:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  server.post("/api/withdraw", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
      }

      const decodedToken = jwt.verify(token, secretKey);

      if (!decodedToken) {
        throw new JsonWebTokenError("jwt malformed");
      }

      const userId = decodedToken.userId;

      // 데이터베이스에서 isWithdrawn 상태를 true로 변경
      const [result] = await db.query(
        "UPDATE users SET isWithdrawn = true WHERE userId = ?",
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

server.post('/api/uploadImage', upload.single('image'), async (req, res) => {
  try {
    // 업로드 성공 시 클라이언트에 응답
    res.status(200).json({ success: true, message: '이미지 업로드 성공' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

server.post('/customer/writingPage/create-post', async (req, res) => {
  const { title, content, password } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO board (title, content, date, password)
      VALUES (?, ?, ?, ?)`,
      [title, content, currentDate, password]
    );
    conn.release();
    res.status(201).send('board create successfully');
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).send('Error creating board');
  }
});


  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

