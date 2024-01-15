"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";

interface OrderInfo {
  Order_Index: string;
  Subs_Index: string;
  Product_Index: string;
  Product_Index2: string;
  Product_Index3: string;
  User_Index: string;
  Subs_Start: string;
  Subs_End: string;
  user_name: string;
  user_phone: string;
  address: string;
  detailaddress: string;
  postcode: string;
  auto_renew: number;
  staus: number;
}

const pageSize = 10; // 페이지당 표시할 항목 수

export default function OrderInfoPage() {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("User_Index"); // 기본값은 userId로 설정

  const [filterStatus, setFilterStatus] = useState("all"); // 모두 보기
  const [filterRenew, setFilterRenew] = useState("all"); // 모두 보기

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/admin/order?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "User_Index") {
          apiUrl += "&searchOption=User_Index&searchTerm=" + searchTerm;
        } else if (searchOption === "user_name") {
          apiUrl += "&searchOption=user_name&searchTerm=" + searchTerm;
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

  // 갱신여부와 구독상태에 따라 데이터 필터링
  const filteredOrders = orders.filter((order) => {
    if (!order) {
      // handle the case where order is null or undefined
      return false;
    }

    
    const statusCondition =
      filterStatus === "all" || order.staus.toString() === filterStatus;
    const renewCondition =
      filterRenew === "all" || order.auto_renew.toString() === filterRenew;
  
    return statusCondition && renewCondition;
  });

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
        <h1 className={styles.title}>구독 내역 조회</h1>
        <label htmlFor="searchOption"></label>
        <select
          id="searchOption"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className={styles.select}
        >
          <option value="User_Index">아이디</option>
          <option value="user_name">이름</option>
        </select>
        <input
          type="text"
          placeholder={`${
            searchOption === "User_Index" ? "주문자 ID" : "이름으"
          }로 검색`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <div className={styles.orderContent}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>구독 서비스</th>
                <th>상품1</th>
                <th>상품2</th>
                <th>상품3</th>
                <th>구독 시작일</th>
                <th>구독 만료일</th>
                <th>구독자 아이디</th>
                <th>구독 이름</th>
                <th>핸드폰</th>
                <th>우편번호</th>
                <th>주소</th>
                <th>상세주소</th>
                <th>
                  갱신여부
                  <select
                    id="filterRenew"
                    value={filterRenew}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filter}
                  >
                    <option value="all">모두</option>
                    <option value="1">갱신</option>
                    <option value="0">미갱신</option>
                  </select>
                </th>
                <th>
                  구독상태
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterRenew(e.target.value)}
                    className={styles.filter}
                  >
                    <option value="all">모두</option>
                    <option value="1">구독</option>
                    <option value="0">해지</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.Order_Index}>
                  <td>{order.Order_Index}</td>
                  <td>{order.Subs_Index}</td>
                  <td>{order.Product_Index}</td>
                  <td>{order.Product_Index2}</td>
                  <td>{order.Product_Index3}</td>
                  <td>{formatdate(order.Subs_Start)}</td>
                  <td>{formatdate(order.Subs_End)}</td>
                  <td>{order.User_Index}</td>
                  <td>{order.user_name}</td>
                  <td>{order.user_phone}</td>
                  <td>{order.postcode}</td>
                  <td>{order.address}</td>
                  <td>{order.detailaddress}</td>
                  <td>{order.auto_renew === 1 ? "미갱신" : "갱신"}</td>
                  <td>{order.staus === 1 ? "해지" : "구독"}</td>
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
