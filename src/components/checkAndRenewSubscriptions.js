async function CheckAndRenewSubscriptions(pool) {
    try {
      // 현재 시각 출력
      console.log("현재 시각:", new Date());
  
      // 종료일로부터 1일 이내의 데이터 가져오기
      const [rows, fields] = await pool.query(
        "SELECT Order_Index, Subs_Index, User_Index, Subs_Start, Subs_End, address, user_name, user_phone, postcode,detailaddress ,Product_Index, Product_Index2, Product_Index3, productName1, productName2, productName3 FROM orderdetails WHERE Subs_End >= NOW() AND Subs_End <= NOW() + INTERVAL 1 DAY AND auto_renew = 1"
      );
     
      
      // 데이터베이스의 Subs_End 값 출력
      console.log(
        "데이터베이스의 Subs_End 값:",
        rows.map((row) => row.Subs_End)
      );
  
      // 각 데이터에 대해 새로운 Subscription 데이터 추가
      for (const row of rows) {
        const { Order_Index, Subs_Index, User_Index, Subs_End, address, user_name, user_phone, postcode,detailaddress ,Product_Index, Product_Index2, Product_Index3, productName1, productName2, productName3 } = row;
  
        // 해당 주문의 구독 주기 조회
        const weekQuery = `SELECT Week FROM subscription WHERE Subs_Index = ?`;
        const [weekResult] = await pool.query(weekQuery, [Subs_Index]);
  
        if (weekResult.length > 0) {
          const week = weekResult[0].Week;
  
          // 새로운 종료일 결정 (예: week * 7일 연장)
          const endDate = new Date(Subs_End);
          endDate.setDate(endDate.getDate() + week * 7); // Subs_End에서 주차 수에 따라 더하기
          const newDate = new Date(Subs_End);
          newDate.setDate(newDate.getDate()-1)

          // INSERT 쿼리를 통해 새로운 Subscription 데이터를 DB에 추가
          await pool.query(
            "INSERT INTO orderdetails (Subs_Start, Subs_End, Subs_Index, User_Index, address ,user_name, user_phone, postcode,detailaddress ,Product_Index, Product_Index2, Product_Index3, productName1, productName2, productName3) VALUES (?, ?, ?, ?, ?,?,? ,? ,?,?,?,?,?,?,?)",
            [newDate, endDate, Subs_Index, User_Index, address,user_name, user_phone, postcode,detailaddress ,Product_Index, Product_Index2, Product_Index3, productName1, productName2, productName3]
          );

             // subscription 테이블에서 price 값을 가져오는 쿼리
              const priceQuery = `SELECT price FROM subscription WHERE Subs_Index = ?`;
              const [priceResult] = await pool.query(priceQuery, [Subs_Index]);

              if (priceResult.length > 0) {
                const price = priceResult[0].price;

                // users 테이블에서 cash 값을 가져오는 쿼리
                const cashQuery = `SELECT cash FROM users WHERE User_Index = ?`;
                const [cashResult] = await pool.query(cashQuery, [User_Index]);

                if (cashResult.length > 0) {
                  const currentCash = cashResult[0].cash;

                  // cash에서 price를 뺀 값이 0보다 작으면 구독 갱신 실패
                  if (currentCash - price < 0) {
                    console.log("구독 갱신 실패! 현재 cash 부족");
                    
                    // 현재 구독의 auto_renew와 status 값을 0으로 업데이트
                    await pool.query(
                      "UPDATE orderdetails SET auto_renew = 0, status = 0 WHERE Order_Index = ?",
                      [Order_Index]
                    );

                    await pool.query(
                      "UPDATE users SET Order_Index = NULL WHERE User_Index = ? AND Order_Index = ?",
                      [User_Index, Order_Index]
                    );
                  } else {
                    // cash에서 price를 빼는 새로운 cash 값 계산
                    const newCash = currentCash - price;

                    // users 테이블 업데이트 쿼리
                    await pool.query(
                      "UPDATE users SET cash = ? WHERE User_Index = ?",
                      [newCash, User_Index]
                    );

                    console.log("구독 갱신 성공! 가격:", price, "새로운 cash:", newCash);

                    // 가격을 이용하여 추가 작업 수행
                    // 예: 가격을 이용하여 결제 등의 작업 수행
                    
                    // 현재 구독의 auto_renew와 status 값을 0으로 업데이트
                    await pool.query(
                      "UPDATE orderdetails SET auto_renew = 0, status = 0 WHERE Order_Index = ?",
                      [Order_Index]
                    );

                    await pool.query(
                      "UPDATE users SET Order_Index = ? WHERE User_Index = ?",
                      [Order_Index, User_Index]
                    );
                    
                  }
                }
              }
        }
      }
  
      // 새로운 행 추가 조건 확인
      if (rows.length > 0) {
        console.log("새로운 행 추가 조건이 충족되었습니다.");
      } else {
        console.log("새로운 행 추가 조건이 충족되지 않았습니다.");
      }
    } catch (error) {
      console.error(
        "SubscriptionChecker.js에서 오류가 발생했습니다:",
        error.message
      );
    }
  }
  
  module.exports = { CheckAndRenewSubscriptions };