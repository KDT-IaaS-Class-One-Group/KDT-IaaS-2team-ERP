"use client";
import React, { useState, useEffect, useCallback } from "react";
import NavLinks from "@/components/dashboard/user/User-nav-links-b";
import styles from "@/styles/adminuser.module.scss";
import { useRadioGroup } from "@chakra-ui/react";

interface UserInfo {
  User_Index: string;
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  postcode: string;
  address: string;
  detailaddress: string;
  gender: string;
  cash: string;
  joinDate: string;
  isWithdrawn: number;
  order_Index: number;
}

const pageSize = 10; // 페이지당 표시할 항목 수

export default function UserinfoPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정
  const [selectedBoard, setSelectedBoard] = useState<UserInfo | null>(null);

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/admin/users?page=" + page + "&pageSize=" + pageSize;

        if (searchOption === "userId") {
          apiUrl += "&searchOption=userId&searchTerm=" + searchTerm;
        } else if (searchOption === "name") {
          apiUrl += "&searchOption=name&searchTerm=" + searchTerm;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        setUsers(data.users);
        setPageInfo({
          currentPage: data.pageInfo.currentPage,
          pageSize: data.pageInfo.pageSize,
          totalPages: data.pageInfo.totalPages,
        });
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
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

  const formatBirthdate = (birthdate: string) => {
    const birthdateDate = new Date(birthdate);
    const birthdateLocalString = birthdateDate.toLocaleDateString();
    return birthdateLocalString;
  };

  const handleModalClose = () => {
    setSelectedBoard(null);
  };

  const handleRowClick = (user: UserInfo) => {
    setSelectedBoard(user);
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
        {/* <h1 className={styles.title}>회원 정보 조회</h1> */}
        <label htmlFor="searchOption"></label>
        <select
          id="searchOption"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className={styles.select}
        >
          <option value="userId">ID</option>
          <option value="name">Name</option>
        </select>
        <input
          type="text"
          placeholder={`${searchOption === "userId" ? "ID" : "Name"}로 검색`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <div className={styles.userContent}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>회원번호</th>
                <th>아이디</th>
                <th>이름</th>
                <th>생년월일</th>
                <th>핸드폰</th>
                <th>이메일</th>
                <th>우편번호</th>
                <th>주소</th>
                <th>상세주소</th>
                <th>성별</th>
                <th>잔여캐쉬</th>
                <th>가입일</th>
                <th>가입여부</th>
                <th>주문번호</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} onClick={() => handleRowClick(user)}>
                  <td>{user.User_Index}</td>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{formatBirthdate(user.birthdate)}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.postcode}</td>
                  <td>{user.address}</td>
                  <td>{user.detailaddress}</td>
                  <td>{user.gender}</td>
                  <td>{user.cash}</td>
                  <td>{formatBirthdate(user.joinDate)}</td>
                  <td>{user.isWithdrawn === 1 ? "탈퇴" : "가입"}</td>
                  <td>{user.order_Index}</td>
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
                        <td>회원번호</td>
                        <td>{selectedBoard.User_Index}</td>
                      </tr>
                      <tr>
                        <td>아이디</td>
                        <td>{selectedBoard.userId}</td>
                      </tr>
                      <tr>
                        <td>이름</td>
                        <td>{selectedBoard.name}</td>
                      </tr>
                      <tr>
                        <td>생년월일</td>
                        <td>{formatBirthdate(selectedBoard.birthdate)}</td>
                      </tr>
                      <tr>
                        <td>핸드폰</td>
                        <td>{selectedBoard.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td>이메일</td>
                        <td>{selectedBoard.email}</td>
                      </tr>
                      <tr>
                        <td>우편번호</td>
                        <td>{selectedBoard.postcode}</td>
                      </tr>
                      <tr>
                        <td>주소</td>
                        <td>{selectedBoard.address}</td>
                      </tr>
                      <tr>
                        <td>상세주소</td>
                        <td>{selectedBoard.detailaddress}</td>
                      </tr>
                      <tr>
                        <td>성별</td>
                        <td>{selectedBoard.gender}</td>
                      </tr>
                      <tr>
                        <td>잔여캐쉬</td>
                        <td>{selectedBoard.cash}</td>
                      </tr>
                      <tr>
                        <td>가입일</td>
                        <td>{formatBirthdate(selectedBoard.joinDate)}</td>
                      </tr>
                      <tr>
                        <td>가입여부</td>
                        <td>
                          {selectedBoard.isWithdrawn === 1 ? "탈퇴" : "가입"}
                        </td>
                      </tr>
                      <tr>
                        <td>주문번호</td>
                        <td>
                          {selectedBoard.order_Index}
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
