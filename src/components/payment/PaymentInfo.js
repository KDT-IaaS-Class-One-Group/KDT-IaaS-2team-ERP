import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

const PaymentInfo = ({ userName }) => {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/"); // Replace "/" with your main page URL
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      style={{
        width:"100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>결제 완료</h1>
      <p>주문자 정보: {userName}</p>
    </div>
  );
};

export default PaymentInfo;