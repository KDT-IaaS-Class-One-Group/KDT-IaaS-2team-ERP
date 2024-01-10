"use client";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import styles from "@/styles/order-b.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";

interface SubscriptionInfo {
  subs_index: string;
  name: string;
  week: string;
  size: string;
  price: string;
}

const pageSize = 13; // 페이지당 표시할 항목 수

export default function SubsProduct() {
  const [showForm, setShowForm] = useState(false);
  const [subs, setSubs] = useState<SubscriptionInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 13,
    totalPages: 1,
  });

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [pageInfo.currentPage]);

  const fetchData = async (page: number) => {
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
    subs_index: "",
    name: "",
    week: "",
    size: "",
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
        fetchData(pageInfo.currentPage);
      } else {
        // 오류 응답 처리
        console.error(`Error adding subscription: ${response.status}`);
      }

      // 입력 폼 초기화
      setSubscriptionInfo({
        subs_index: "",
        name: "",
        week: "",
        size: "",
        price: "",
      });
      setShowForm(false); // 폼 닫기
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error adding subscription:", error);
    }
  };

  const handleDelete = async (subs_index: string) => {
    try {
      const response = await fetch(`/api/subs-product/${subs_index}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Subscription deleted successfully");
        fetchData(pageInfo.currentPage);
        alert("삭제 완료");
      } else {
        console.error(`Error deleting subscription: ${response.status}`);
        alert("삭제 실패");
      }
    } catch (error) {
      // 네트워크 오류 및 기타 예외 처리
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>구독 관리</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          추가
        </button>
        {showForm && (
          <div className={styles.addSubscription}>
            <label className={styles.addLabel}>
              Name:  
              <input
                type="text"
                name="name"
                value={subscriptionInfo.name}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Week:  
              <input
                type="text"
                name="week"
                value={subscriptionInfo.week}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Size:  
              <input
                type="text"
                name="size"
                value={subscriptionInfo.size}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <label className={styles.addLabel}>
              Price:  
              <input
                type="text"
                name="price"
                value={subscriptionInfo.price}
                onChange={handleChange}
                className={styles.addInput}
              />
            </label>
            <button onClick={handleSubmit} className={styles.delButton}>추가</button>
          </div>
        )}
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>subs_index</th>
                <th>name</th>
                <th>week</th>
                <th>size</th>
                <th>price</th>
              <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.subs_index}>
                  <td>{sub.subs_index}</td>
                  <td>{sub.name}</td>
                  <td>{sub.week}</td>
                  <td>{sub.size}</td>
                  <td>{sub.price}</td>
                  <td>
                  <button className={styles.delButton} onClick={() => handleDelete(sub.subs_index)}>삭제</button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from(
              { length: pageInfo.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`${styles.paginationButton} ${
                  pageNumber === pageInfo.currentPage ? styles.active : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
