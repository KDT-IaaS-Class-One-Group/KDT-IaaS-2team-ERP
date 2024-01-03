"use client";
import React, { useState, useEffect } from "react";
import NavLinks from "@/components/dashboard/member/Member-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Info from "@/components/dashboard/member/Info-b";

interface UserInfo {
  id: string;
  userId: string;
  name: string;
  birthdate: string;
  cash: string;
  isWithdrawn: number;
}

export default function UserinfoPage() {
  const [editedCash, setEditedCash] = useState<string>("");
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      const userList = Array.isArray(data) && data.length > 0 ? data[0] : [];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
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
        body: JSON.stringify({ cash: editedCash }),
      });
      // 수정 후 데이터 다시 불러오기
      fetchData();
      // 수정된 Cash 값을 초기화
      setEditedCash("");
    } catch (error) {
      console.error("Error updating cash:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCash(e.target.value);
  };

  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>회원 캐시 관리</h1>
        <div className={styles.userinfocontent}>
          <table className="min-w-full">
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
                      value={editedCash}
                      onChange={(e) => setEditedCash(e.target.value)}
                    />
                    <button onClick={() => handleCashEdit(user.userId)}>
                      수정
                    </button>
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