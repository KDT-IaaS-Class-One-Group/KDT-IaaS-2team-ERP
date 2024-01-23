"use client";

import React, { useState, useEffect, useCallback } from "react";
import NavLinks from "@/components/dashboard/user/User-nav-links-b";
import styles from "@/styles/adminuser.module.scss";

interface UserInfo {
  id: string;
  userId: string;
  name: string;
  birthdate: string;
  cash: string;
}

const pageSize = 9; // 페이지당 표시할 항목 수

export default function UsercashPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 9,
    totalPages: 1,
  });

  const [editedCash, setEditedCash] = useState<{ [userId: string]: string }>(
    {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("userId"); // 기본값은 userId로 설정

  const fetchData = useCallback(
    async (page: number) => {
      try {
        let apiUrl = "/api/users/cash?page=" + page + "&pageSize=" + pageSize;

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

  const handleCashEdit = async (userId: string) => {
    try {
      // API 호출하여 cash 수정
      await fetch(`/api/updateCash/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cash: editedCash[userId] }),
      });
      // 수정 후 데이터 다시 불러오기
      fetchData(pageInfo.currentPage);
      // 수정된 Cash 값을 초기화
      setEditedCash((prev) => ({ ...prev, [userId]: "" }));
    } catch (error) {
      console.error("Error updating cash:", error);
    }
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
        {/* <h1 className={styles.title}>회원 캐시 관리</h1> */}
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
                <th>아이디</th>
                <th>이름</th>
                <th>생년월일</th>
                <th>캐쉬</th>
                <th>캐쉬 수정</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{formatBirthdate(user.birthdate)}</td>
                  <td>{user.cash}</td>
                  <td>
                    <input
                      type="text"
                      value={editedCash[user.userId] || ""}
                      onChange={(e) =>
                        setEditedCash((prev) => ({
                          ...prev,
                          [user.userId]: e.target.value,
                        }))
                      }
                      className={styles.cashInput}
                    />
                    <button
                      className={styles.cashButton}
                      onClick={() => handleCashEdit(user.userId)}
                    >
                      수정
                    </button>
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
