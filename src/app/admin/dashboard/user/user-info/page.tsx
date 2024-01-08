'use client'
import React, { useState, useEffect, useCallback } from 'react';
import NavLinks from "@/components/dashboard/user/User-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import { useSearchParams } from 'react-router-dom';

interface UserInfo {
  id: string;
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
const pageSize = 10; // 페이지당 표시할 항목 수

export default function UserinfoPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, pageSize: 10, totalPages: 1 });

  const fetchData = useCallback(async () => {
    try {
      let url = `/api/users?page=${pageInfo.currentPage}&pageSize=${pageSize}`;

      if (searchTerm) {
        url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setUsers(data.users);

      setPageInfo({
        currentPage: data.pageInfo.currentPage, // Set currentPage to 1 for search results
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error('회원 정보 불러오기 오류:', error);
    }
  }, [pageInfo.currentPage, searchTerm]); // 의존성 배열 수정

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPageInfo({
      ...pageInfo,
      currentPage: newPage,
    });
    if (searchTerm) {
      setSearchTerm(""); // Reset search term when changing pages
    }
  };
  const handleApproval = async (userId: string) => {
    try {
      // API 호출하여 승인 처리
      await fetch(`/api/approveUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // 승인 후 데이터 다시 불러오기
      fetchData();
    } catch (error) {
      console.error('사용자 승인 오류:', error);
    }
  };

  const formatBirthdate = (birthdate: string) => {
    const birthdateDate = new Date(birthdate);
    const birthdateLocalString = birthdateDate.toLocaleDateString();
    return birthdateLocalString;
  };

  // 검색어를 기반으로 사용자를 필터링하는 함수
  const filterUsers = (usersList: UserInfo[], term: string) => {
    return usersList.filter(
      (user) =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.userId.toLowerCase().includes(term.toLowerCase())
    );
  };

  // 검색어 또는 사용자 목록이 변경될 때마다 필터된 사용자 업데이트
  useEffect(() => {
    filterUsers(users, searchTerm);
  }, [searchTerm, users]);


  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
    <main className={styles.main}>
      <h1>
        회원 정보 관리
      </h1>
      <div className="search-container">
          <input
            type="text"
            placeholder="이름 또는 아이디로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <div className={styles.userinfocontent}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Cash</th>
              <th>탈퇴신청</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {filterUsers(users, searchTerm).map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{formatBirthdate(user.birthdate)}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.gender}</td>
                <td>{user.cash}</td>
                <td>{user.isWithdrawn === 1 ? '신청' : '미신청'}</td>
                <td>
                  {user.isWithdrawn === 1 && (
                    <button onClick={() => handleApproval(user.userId)}>승인</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
        {Array.from({ length: pageInfo.totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`pagination-button ${pageNumber === pageInfo.currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        </div>
      </div>
    </main>
    </>
  );
}