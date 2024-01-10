'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
const jwt = require("jsonwebtoken");

const PaymentPage = () => {
  const [orderIndexData, setOrderIndexData] = useState([]);
  const [userIndex, setUserIndex] = useState(null);

  useEffect(() => {
    // 서버에서 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        // 로컬 스토리지에서 토큰 가져오기 (실제로는 보안상의 이유로 더 안전한 방법 사용을 고려해야 함)
        const token = localStorage.getItem("token");

        // 서버에 토큰을 포함하여 요청
        const response = await axios.get("/api/orderindex", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 토큰에서 User_Index 추출
        const decodedToken = decodeToken(token);
        setUserIndex(decodedToken.User_Index);

        setOrderIndexData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // 페이지 로딩 시 데이터 가져오기
    fetchData();
  }, []);

  const decodeToken = (token) => {
    // 토큰 디코딩 함수 (실제로는 더 안전한 방법 사용을 고려해야 함)
    const decoded = jwt.decode(token, { complete: true });
    return decoded.payload;
  };

  return (
    <div>
      <h1>결제 페이지</h1>
      <p>User_Index: {userIndex}</p>
      <ul>
        {orderIndexData.map((orderIndex) => (
          <li key={orderIndex}>{orderIndex}</li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentPage;