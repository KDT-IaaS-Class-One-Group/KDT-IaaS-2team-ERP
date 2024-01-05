"use client";
import React, { useState, ChangeEvent } from "react";

interface ProductInfo {
  category_id: string;
  product_name: string;
  stock_quantity: string;
  info: string;
}

export default function Product() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [productInfo, setproductInfo] = useState<ProductInfo>({
    category_id: "",
    product_name: "",
    stock_quantity: "",
    info: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setproductInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productInfo),
      });

      if (response.ok) {
        // 성공적인 응답 처리
        console.log("Subscription added successfully");
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
      }

      // 입력 폼 초기화
      setproductInfo({
        category_id: "",
        product_name: "",
        stock_quantity: "",
         info: "",
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  return (
    <>
      <h1>원두 상품 관리</h1>
      <button onClick={() => setShowForm(!showForm)}>원두 추가</button>
      {showForm && (
        <div>
          <label>
          category_id:
            <input
              type="text"
              name="category_id"
              value={productInfo.category_id}
              onChange={handleChange}
            />
          </label>
          <label>
          product_name:
            <input
              type="text"
              name="product_name"
              value={productInfo.product_name}
              onChange={handleChange}
            />
          </label>
          <label>
          stock_quantity:
            <input
              type="text"
              name="stock_quantity"
              value={productInfo.stock_quantity}
              onChange={handleChange}
            />
          </label>
          <label>
          info:
            <input
              type="text"
              name="info"
              value={productInfo.info}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSubmit}>추가</button>
        </div>
      )}
    </>
  );
}
