import React from "react";
import Link from "next/link";

const PaymentButton = ({ onClick }) => {
  return (
    <Link href={`/payment`}>
      <button onClick={onClick} style={{ width:"10vw", height:"4vh", marginTop:"2vh", borderRadius: "20px", backgroundColor: "#f9efdbb9", color: "#135206"}}>결제하기</button>
    </Link>
  );
};

export default PaymentButton;
