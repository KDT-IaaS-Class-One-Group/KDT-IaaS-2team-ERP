import NavLinks from "@/components/dashboard/member/Member-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Info from "@/components/dashboard/member/Info-b";

'use client'
import React, { useState, useEffect } from 'react';

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
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        회원 정보 관리
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        dfdf
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      </div>
    </main>
  );
}
