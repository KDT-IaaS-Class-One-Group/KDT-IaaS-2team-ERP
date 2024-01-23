import React from "react";
import Link from "next/link";

const PaymentButton = ({ onClick }) => {
  return (
    <Link href={`/payment`}>
      <button
        onClick={onClick}
        style={{
          fontSize: "1.1rem",
          width: "20vw",
          height: "7vh",
          marginTop: "4vh",
          borderRadius: "5px",
          backgroundColor: "#27374D",
          color: "white",
          border: "0",
          cursor: "pointer",
        }}
      >
        결제하기
      </button>
    </Link>
  );
};

export default PaymentButton;