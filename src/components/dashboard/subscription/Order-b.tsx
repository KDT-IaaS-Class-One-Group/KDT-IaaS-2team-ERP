"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/adminorder.module.scss";
import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";

interface OrderInfo {
  Order_Index: string;
  subs_index: string;
  product1: string;
  product2: string;
  product3: string;
  User_Index: string;
  userId: string;
  Subs_Start: string;
  Subs_End: string;
  order_name: string;
  order_phone: string;
  address: string;
  zip_code: string;
  auto_renew: number;
  staus: number;
}

const pageSize = 10;

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

  const [selectedBoard, setSelectedBoard] = useState<OrderInfo | null>(null);

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/admin/order?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "User_Index") {
          apiUrl += "&searchOption=User_Index&searchTerm=" + searchTerm;
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

  const handleModalClose = () => {
    setSelectedBoard(null);
  };

  const handleRowClick = (order: OrderInfo) => {
    setSelectedBoard(order);
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
        <h1 className={styles.title}>구독 내역 조회</h1>
        <label htmlFor="searchOption"></label>
        <select
          id="searchOption"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className={styles.select}
        >
          <option value="User_Index">ID</option>
          <option value="order_name">구독 서비스</option>
        </select>
        <input
          type="text"
          placeholder={`${
            searchOption === "User_Index" ? "주문자 ID" : "구독 서비스명으"
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
                <th>구독번호</th>
                <th>주문상품1</th>
                <th>주문상품2</th>
                <th>주문상품3</th>
                <th>주문자 ID</th>
                <th>구독 시작일</th>
                <th>구독 만료일</th>
                <th>구독 서비스</th>
                <th>번호</th>
                <th>주소</th>
                <th>우편번호</th>
                <th>
                  갱신여부
                  <select
                    id="filterRenew"
                    value={filterRenew}
                    onChange={(e) => setFilterRenew(e.target.value)}
                    className={styles.filter}
                  >
                    <option value="all">모두</option>
                    <option value="1">미갱신</option>
                    <option value="0">갱신</option>
                  </select>
                </th>
                <th>
                  구독상태
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filter}
                  >
                    <option value="all">모두</option>
                    <option value="1">해지</option>
                    <option value="0">구독</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.Order_Index}
                  onClick={() => handleRowClick(order)}
                >
                  <td>{order.Order_Index}</td>
                  <td>{order.subs_index}</td>
                  <td>{order.product1}</td>
                  <td>{order.product2}</td>
                  <td>{order.product3}</td>
                  <td>{order.userId}</td>
                  <td>{formatdate(order.Subs_Start)}</td>
                  <td>{formatdate(order.Subs_End)}</td>
                  <td>{order.order_name}</td>
                  <td>{order.order_phone}</td>
                  <td>{order.address}</td>
                  <td>{order.zip_code}</td>
                  <td>{order.auto_renew === 1 ? "미갱신" : "갱신"}</td>
                  <td>{order.staus === 1 ? "해지" : "구독"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBoard !== null && (
            <div className={`${styles.modal} ${styles.show}`}>
              <div>
                <div className={styles.modalContent}>
                  <span className={styles.close} onClick={handleModalClose}>
                    &times;
                  </span>
                  <table className={styles.infoTable}>
                    <tbody>
                      <tr>
                        <td>주문번호</td>
                        <td>{selectedBoard.Order_Index}</td>
                      </tr>
                      <tr>
                        <td>구독번호</td>
                        <td>{selectedBoard.subs_index}</td>
                      </tr>
                      <tr>
                        <td>주문상품1</td>
                        <td>{selectedBoard.product1}</td>
                      </tr>
                      <tr>
                        <td>주문상품2</td>
                        <td>{selectedBoard.product2}</td>
                      </tr>
                      <tr>
                        <td>주문상품3</td>
                        <td>{selectedBoard.product3}</td>
                      </tr>
                      <tr>
                        <td>주문자ID</td>
                        <td>{selectedBoard.userId}</td>
                      </tr>
                      <tr>
                        <td>구독 시작일</td>
                        <td>{formatdate(selectedBoard.Subs_Start)}</td>
                      </tr>                      <tr>
                        <td>구독 만료일</td>
                        <td>{formatdate(selectedBoard.Subs_End)}</td>
                      </tr>
                      <tr>
                        <td>구독 서비스</td>
                        <td>{selectedBoard.order_name}</td>
                      </tr>
                      <tr>
                        <td>번호</td>
                        <td>{selectedBoard.order_phone}</td>
                      </tr>
                      <tr>
                        <td>주소</td>
                        <td>{selectedBoard.address}</td>
                      </tr>
                      <tr>
                        <td>우편번호</td>
                        <td>{selectedBoard.zip_code}</td>
                      </tr>
                      <tr>
                        <td>갱신여부</td>
                        <td>{selectedBoard.auto_renew === 1 ? "미갱신" : "갱신"}</td>
                      </tr>
                      <tr>
                        <td>구독여부</td>
                        <td>
                          {selectedBoard.staus === 1 ? "해지" : "구독"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          <div>
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
