async function checkAndRenewSubscriptions(pool) {
    try {
      // 현재 시각 출력
      console.log("현재 시각:", new Date());
  
      // 종료일로부터 1일 이내의 데이터 가져오기
      const [rows, fields] = await pool.query(
        "SELECT Order_Index, Subs_Index, User_Index, Subs_End, address FROM orderdetails WHERE Subs_End >= NOW() AND Subs_End <= NOW() + INTERVAL 1 DAY"
      );
  
      // 데이터베이스의 Subs_End 값 출력
      console.log(
        "데이터베이스의 Subs_End 값:",
        rows.map((row) => row.Subs_End)
      );
  
      // 각 데이터에 대해 새로운 Subscription 데이터 추가
      for (const row of rows) {
        const { Order_Index, Subs_Index, User_Index, Subs_End, address } = row;
  
        // 해당 주문의 구독 주기 조회
        const weekQuery = `SELECT Week FROM subscription WHERE Subs_Index = ?`;
        const [weekResult] = await pool.query(weekQuery, [Subs_Index]);
  
        if (weekResult.length > 0) {
          const week = weekResult[0].Week;
  
          // 새로운 종료일 결정 (예: week * 7일 연장)
          const endDate = new Date(Subs_End);
          endDate.setDate(endDate.getDate() + week * 7); // Subs_End에서 주차 수에 따라 더하기
  
          // INSERT 쿼리를 통해 새로운 Subscription 데이터를 DB에 추가
          await pool.query(
            "INSERT INTO orderdetails (Subs_Start, Subs_End, Subs_Index, User_Index, address) VALUES (?, ?, ?, ?, ?)",
            [Subs_End, endDate, Subs_Index, User_Index, address]
          );
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
  
  module.exports = { checkAndRenewSubscriptions };