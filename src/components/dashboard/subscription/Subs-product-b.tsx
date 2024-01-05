"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "@/styles/adminsubproduct.module.scss";

interface SubscriptionInfo {
  Subs_Index: string;
  product_Index: string;
  name: string;
  week: string;
  price: string;
}

export default function SubsProduct() {
  const [showForm, setShowForm] = useState(false);
  const [subs, setSubs] = useState<SubscriptionInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage, 10);
  }, [pageInfo.currentPage]);

  const fetchData = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(
        `/api/subs-product?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
    setSubs(data.subs);
      

      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error("Error fetching subs:", error);
    }
  };

  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    Subs_Index: "",
    product_Index: "",
    name: "",
    week: "",
    price: "",
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
      const response = await fetch("/api/subs-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionInfo),
      });

      if (response.ok) {
        // 성공적인 응답 처리
        console.log("Subscription added successfully");
        fetchData(pageInfo.currentPage, 10);
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
      }

      // 입력 폼 초기화
      setSubscriptionInfo({
        Subs_Index: "",
        product_Index: "",
        name: "",
        week: "",
        price: "",
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  return (
      <div className={styles.subproduct}>
        <h1>구독 상품 관리</h1>
        <button onClick={() => setShowForm(!showForm)}>구독 상품 추가</button>
      {showForm && (
        <div>
          <label>
            Product Index:
            <input
              type="text"
              name="product_Index"
              value={subscriptionInfo.product_Index}
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
            Week:
            <input
              type="text"
              name="week"
              value={subscriptionInfo.week}
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
          <button onClick={handleSubmit}>추가</button>
          </div>
          )}
          <div className="subscription">
          <table className={styles.subscriptionTable}>
            <thead>
              <tr>
                <th>Subs_Index</th>
                <th>product_Index</th>
                <th>name</th>
                <th>week</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.Subs_Index}>
                  <td>{sub.Subs_Index}</td>
                  <td>{sub.product_Index}</td>
                  <td>{sub.name}</td>
                  <td>{sub.week}</td>
                  <td>{sub.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from({ length: pageInfo.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`pagination-button ${
                  pageNumber === pageInfo.currentPage ? 'active' : ''
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            </div>
          </div>
      </div>
  )}