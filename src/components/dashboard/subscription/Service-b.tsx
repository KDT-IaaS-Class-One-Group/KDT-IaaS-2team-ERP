"use client";
import React, { useState, ChangeEvent } from "react";
import styles from "@/styles/service-b.module.scss";

interface SubscriptionInfo {
  productIndex: string;
  name: string;
  price: string;
  week: string;
}

export default function Service() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    productIndex: "",
    name: "",
    price: "",
    week: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscriptionInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionInfo),
      });

      if (response.ok) {
        // 성공적인 응답 처리
        console.log("Subscription added successfully");
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
      }

      // 입력 폼 초기화
      setSubscriptionInfo({
        productIndex: "",
        name: "",
        price: "",
        week: "",
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>구독 서비스 관리</h1>
        <button onClick={() => setShowForm(!showForm)}>구독 상품 추가</button>
        {showForm && (
          <div>
            <label>
              Product Index:
              <input
                type="text"
                name="productIndex"
                value={subscriptionInfo.productIndex}
                onChange={handleChange}
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Price:
              <input
                type="text"
                name="price"
                value={subscriptionInfo.price}
                onChange={handleChange}
              />
            </label>
            <label>
              Week:
              <input
                type="text"
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSubmit}>추가</button>
          </div>
        )}
      </div>
    </>
  );
}
