"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/order-b.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";

interface OrderInfo {
  Order_Index: string;
  subs_index: string;
  user_Index: string;
  Subs_Start: string;
  Subs_End: string;
  order_name: string;
  order_phone: string;
  address: string;
  zip_code: string;
  auto_renew: string;
  staus: string;

}

const pageSize = 15; // 페이지당 표시할 항목 수

export default function OrderInfoPage() {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("user_Index"); // 기본값은 userId로 설정

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/admin/order?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "user_Index") {
          apiUrl += "&searchOption=user_Index&searchTerm=" + searchTerm;
        } else if (searchOption === "order_name") {
          apiUrl += "&searchOption=order_name&searchTerm=" + searchTerm;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setOrders(data.orders);
        setPageInfo({
          currentPage: data.pageInfo.currentPage,
          pageSize: data.pageInfo.pageSize,
          totalPages: data.pageInfo.totalPages,
        });
      } catch (error) {
        console.error("주문 정보를 가져오는 중 오류 발생:", error);
      }
    },
    [searchTerm, searchOption]
  );

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
  };


  const formatdate = (date: string) => {
    const dateDate = new Date(date);
    const dateLocalString = dateDate.toLocaleDateString();
    return dateLocalString;
  };

  useEffect(() => {
    fetchData(pageInfo.currentPage);
  }, [fetchData, pageInfo.currentPage]);

  useEffect(() => {
    setSearchTerm("");
  }, []);

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>주문 정보 조회</h1>
        <label htmlFor="searchOption"></label>
        <select
          id="searchOption"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className={styles.select}
        >
          <option value="user_Index">ID</option>
          <option value="order_Name">Name</option>
        </select>
        <input
          type="text"
          placeholder={`${searchOption === "user_Index" ? "user_Index" : "order_Name"}로 검색`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>구독 인덱스</th>
                <th>주문자 인덱스</th>
                <th>구독 시작일</th>
                <th>구독 만료일</th>
                <th>order_name</th>
                <th>order_phone</th>
                <th>address</th>
                <th>zip_code</th>
                <th>auto_renew</th>
                <th>staus</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.Order_Index}>
                  <td>{order.Order_Index}</td>
                  <td>{order.subs_index}</td>
                  <td>{order.user_Index}</td>
                  <td>{formatdate(order.Subs_Start)}</td>
                  <td>{formatdate(order.Subs_End)}</td>
                  <td>{order.order_name}</td>
                  <td>{order.order_phone}</td>
                  <td>{order.address}</td>
                  <td>{order.zip_code}</td>
                  <td>{order.auto_renew}</td>
                  <td>{order.staus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
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
