async function checkAndRenewSubscriptions(pool) {
    try {
      // 현재 시각 출력
      console.log("현재 시각:", new Date());
  
      // 종료일로부터 1일 이내의 데이터 가져오기
      const [rows, fields] = await pool.query(
        "SELECT Order_Index, subs_index, user_Index, price, Subs_End FROM orderdetails WHERE Subs_End >= NOW() AND Subs_End <= NOW() + INTERVAL 1 DAY"
      );
  
      // 데이터베이스의 Subs_End 값 출력
      console.log(
        "데이터베이스의 Subs_End 값:",
        rows.map((row) => row.Subs_End)
      );
  
      // 각 데이터에 대해 새로운 Subscription 데이터 추가
      for (const row of rows) {
        const { Order_Index, subs_index, user_Index, price, Subs_End } = row;
        const existingSubsEndDate = Subs_End; // 기존 데이터의 Subs_End 값
        const startDate = new Date(existingSubsEndDate);
        const endDate = new Date(existingSubsEndDate);
        endDate.setDate(endDate.getDate() + 28); // Subs_End에서 4주(28일) 더하기
  
        // INSERT 쿼리를 통해 새로운 Subscription 데이터를 DB에 추가
        await pool.query(
          "INSERT INTO orderdetails (Subs_Start, Subs_End, subs_index, user_Index, price) VALUES (?, ?, ?, ?, ?)",
          [startDate, endDate, subs_index, user_Index, price]
        );
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