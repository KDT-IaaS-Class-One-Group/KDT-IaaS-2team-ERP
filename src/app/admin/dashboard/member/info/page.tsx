
'use client'
import React, { useState, useEffect } from 'react';
import NavLinks from "@/components/dashboard/member/Member-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Info from "@/components/dashboard/member/Info-b";

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

export default function UserinfoPage() {


  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      const userList = Array.isArray(data) && data.length > 0 ? data[0] : [];
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      console.error('Error approving user:', error);
    }
  };
  

  const formatBirthdate = (birthdate: string) => {
    const birthdateDate = new Date(birthdate);
    const birthdateLocalString = birthdateDate.toLocaleDateString();
    return birthdateLocalString;
  };


  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        회원 정보 관리
      </h1>
      <div className={styles.userinfocontent}>
        <table className="min-w-full">
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
            {users.map((user) => (
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
      </div>
    </main>
    </>
  );
}