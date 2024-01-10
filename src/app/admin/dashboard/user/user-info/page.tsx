"use client";
import React, { useState, useEffect, useCallback } from "react";
import NavLinks from "@/components/dashboard/user/User-nav-links-b";
import styles from "@/styles/adminuser.module.scss";

interface UserInfo {
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  cash: string;
  isWithdrawn: number;
}

const pageSize = 15; // 페이지당 표시할 항목 수

export default function UserinfoPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 15,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/users?page=" + page + "&pageSize=" + pageSize;

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

  const handleApproval = async (userId: string) => {
    try {
      // API 호출하여 승인 처리
      await fetch(`/api/approveUser/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // 승인 후 데이터 다시 불러오기
      fetchData(pageInfo.currentPage);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const formatBirthdate = (birthdate: string) => {
    const birthdateDate = new Date(birthdate);
    const birthdateLocalString = birthdateDate.toLocaleDateString();
    return birthdateLocalString;
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
        <h1 className={styles.title}>회원 정보 조회</h1>
        <label htmlFor="searchOption"></label>
        <select
          id="searchOption"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          className={styles.select}        
          >
          <option  value="userId">ID</option>
          <option value="name">Name</option>
        </select>
        <input
          type="text"
          placeholder={`${
            searchOption === "userId" ? "ID" : "Name"
          }로 검색`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}     
        />
        <div className={styles.userContent}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>생년월일</th>
                <th>핸드폰</th>
                <th>이메일</th>
                <th>주소</th>
                <th>성별</th>
                <th>캐쉬</th>
                <th>탈퇴신청</th>
                <th>탈퇴승인</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{formatBirthdate(user.birthdate)}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.gender}</td>
                  <td>{user.cash}</td>
                  <td>{user.isWithdrawn === 1 ? "신청" : "미신청"}</td>
                  <td>
                    {user.isWithdrawn === 1 && (
                      <button onClick={() => handleApproval(user.userId)}>
                        승인
                      </button>
                    )}
                  </td>
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
