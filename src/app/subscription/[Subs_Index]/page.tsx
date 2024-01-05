"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Subscription() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 현재 URL에서 끝 부분 추출
        const pathSegments = window.location.pathname.split("/");
        const Subs_Index = pathSegments.length >= 3 ? pathSegments[2] : null;
        // API 호출
        const response = await fetch(`/api/test/${Subs_Index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    // fetchData 함수 호출
    fetchData();
  }, []);

  return (
    <div>
      <h1>Subscription</h1>
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <div key={index}>
            <p>Name: {item.name}</p>
            <p>Price: {item.price}</p>
            <p>Week: {item.week}</p>
          </div>
        ))
      ) : (
        <>
          <p>Name: 오류</p>
          <p>Price: 확인</p>
          <p>Week: 바람</p>
          <p> index 확인 </p>
        </>
      )}
      <input type="text" placeholder="상품선택"></input>
      <Link href={`/order`}>
        <button>주문하기</button>
      </Link>
    </div>
  );
}

export default Subscription;
