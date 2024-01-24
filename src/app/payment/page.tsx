"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
const jwt = require("jsonwebtoken");
import PaymentInfo from "../../components/payment/PaymentInfo";
import OrderDetailsList from "../../components/payment/OrderDetailsList";
import Link from "next/link";
import styles from "@/styles/payment.module.scss";

const PaymentPage = () => {
  const [orderIndexData, setOrderIndexData] = useState([]);
  const [userIndex, setUserIndex] = useState(null);
  const [userName, setUserName] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);

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

  const fetchUserName = async () => {
    try {
      // 서버에 사용자 이름을 조회하는 요청을 보냄
      const response = await fetch("/api/userinfo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching user info");
        return;
      }

      const data = await response.json();
      // 조회된 사용자 이름을 상태에 저장
      setUserName(data.name);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      // 서버에 주문 상세 정보를 조회하는 요청을 보냄
      const response = await fetch("/api/orderdetails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching order details");
        return;
      }

      const data = await response.json();
      // 조회된 주문 상세 정보를 상태에 저장
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // 수정: 컴포넌트가 마운트되면 사용자 이름과 주문 상세 정보 조회 함수 호출
  useEffect(() => {
    fetchUserName();
    fetchOrderDetails();
  }, []);

  const decodeToken = (token: string | null) => {
    // 토큰 디코딩 함수 (실제로는 더 안전한 방법 사용을 고려해야 함)
    const decoded = jwt.decode(token, { complete: true });
    return decoded.payload;
  };

  return (
    <div className={styles.container}>
      <PaymentInfo userName={userName} />
      <div>
      <Link href="/">
        <button className={styles.button} >홈으로</button>
      </Link>

      <Link href="/mypage/subscription">
        <button className={styles.button}>구독 정보</button>
      </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
