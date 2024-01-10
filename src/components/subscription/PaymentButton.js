import React from "react";
import Link from "next/link";

const PaymentButton = ({ onClick }) => {
  return (
    <Link href={`/payment`}>
      <button onClick={onClick}>결제하기</button>
    </Link>
  );
};

export default PaymentButton;
