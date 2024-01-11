import React from "react";

const PaymentInfo = ({ userName }) => {
  return (
    <div>
      <h1>결제가 완료되었습니다.</h1>
      <p>주문자 정보: {userName}</p>
    </div>
  );
};

export default PaymentInfo;