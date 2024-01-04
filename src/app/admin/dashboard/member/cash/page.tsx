"use client"

import { useState, useEffect } from 'react';
import NavLinks from '@/components/dashboard/member/Member-nav-links-b';
import styles from '@/styles/adminsidenav.module.scss';

interface UserInfo {
  id: string;
  userId: string;
  name: string;
  birthdate: string;
  cash: string;
  isWithdrawn: number;
}

export default function UsercashPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const [editedCash, setEditedCash] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    fetchData(pageInfo.currentPage, 10);
  }, [pageInfo.currentPage]);

  const fetchData = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(`/api/cash?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      setUsers(data.users);
      setPageInfo({
        currentPage: data.pageInfo.currentPage,
        pageSize: data.pageInfo.pageSize,
        totalPages: data.pageInfo.totalPages,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cash: editedCash[userId] }),
      });
      // 수정 후 데이터 다시 불러오기
      fetchData(pageInfo.currentPage, 10);
      // 수정된 Cash 값을 초기화
      setEditedCash((prev) => ({ ...prev, [userId]: '' }));
    } catch (error) {
      console.error('Error updating cash:', error);
    }
  };

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <main>
        <h1>회원 캐시 관리</h1>
        <div className={styles.userinfocontent}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Birthdate</th>
                <th>Cash</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{formatBirthdate(user.birthdate)}</td>
                  <td>{user.cash}</td>
                  <td>
                    <input
                      type="text"
                      value={editedCash[user.userId] || ''}
                      onChange={(e) => setEditedCash((prev) => ({ ...prev, [user.userId]: e.target.value }))}
                    />
                    <button onClick={() => handleCashEdit(user.userId)}>수정</button>
                  </td>
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
      </main>
    </>
  );
}
