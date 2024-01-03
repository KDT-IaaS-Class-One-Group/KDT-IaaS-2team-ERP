"use client";

import React, { useState, useEffect } from "react";
import NavLinks from "@/components/dashboard/member/Member-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Cash from "@/components/dashboard/member/Cash-b";

interface UserInfo {
  id: string;
  userId: string;
  name: string;
  birthdate: string;
  cash: string;
  isWithdrawn: number;
  input: number;
}

export default function UsercashPage() {
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

  const handleApproval = async (userId: string, inputValue: number) => {
    try {
      // API 호출하여 승인 처리
      await fetch(`/api/approveUser/${inputValue}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, inputValue }),
      });
      // 승인 후 데이터 다시 불러오기
      fetchData();
    } catch (error) {
      console.error("Error approving user:", error);
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
        <h1>회원 캐시 관리</h1>
        <div className={styles.usercashcontent}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Birthdate</th>
                <th>Cash</th>
                <th>Input</th>
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
                  <td>{user.cash}</td>
                  <td>
                    {user.input}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const inputValue = (
                          e.currentTarget.elements.namedItem(
                            "inputValue"
                          ) as any
                        )?.value;
                        const inputValueAsNumber = inputValue
                          ? parseInt(inputValue, 10)
                          : undefined;
                        if (inputValueAsNumber === undefined) {
                          alert("입력값을 입력해주세요.");
                        } else {
                          handleApproval(user.userId, inputValueAsNumber);
                        }
                      }}
                    >
                      <input type="number" name="inputValue" />
                      <button type="submit">확인</button>
                    </form>
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
