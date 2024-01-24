"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentInfo = () => {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/mypage/subscription"); // Replace "/" with your main page URL
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop:"45vh"
      }}
    >
      잔액이 부족합니다. 캐쉬 충전 후에 이용해주세요.
    </div>
  );
};

export default PaymentInfo;
