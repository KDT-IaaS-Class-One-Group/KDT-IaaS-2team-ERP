"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Subscription() {
  const [data, setData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(""); // 추가: 선택된 상품을 저장할 상태

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

  const handleOrderButtonClick = async () => {
    try {
      // 선택된 상품이 없으면 경고 표시
      if (!selectedProduct) {
        alert("상품을 선택하세요.");
        return;
      }

      // 'api/order'로 POST 요청 보내기
      const response = await fetch(`/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: selectedProduct,
          // 기타 필요한 데이터 추가
        }),
      });

      // 응답 처리 (예: 성공 시 다음 화면으로 이동)
      if (response.ok) {
        // 성공 처리
        console.log("주문 성공!");
        // 예시로 홈페이지로 이동
        // 실제로는 필요에 따라 다른 처리를 하셔야 합니다.
        window.location.href = "/";
      } else {
        // 실패 처리
        console.error("주문 실패:", response.statusText);
      }
    } catch (error) {
      console.error("주문 요청 중 오류 발생:", error);
    }
  };

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
      <input
        type="text"
        placeholder="상품선택"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      ></input>
      <Link href={`/order`}>
      <button onClick={handleOrderButtonClick}>주문하기</button>
      </Link>
    </div>
  );
}

export default Subscription;
