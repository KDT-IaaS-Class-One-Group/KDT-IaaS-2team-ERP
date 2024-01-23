"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/adminlogin.module.scss";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      const { token } = data;
      localStorage.setItem("token", token);
      console.log("로그인 성공");

      router.push("/admin/dashboard/user/user-info");
      setIsLoggedIn(true);
    } else {
      alert("로그인 실패!");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin/dashboard/user/user-info");
    }
  }, [isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>로그인 후 관리자페이지를 이용하세요</h1>
      <form className={styles.form}>
        <label className={styles.label}>
          <input
            type="text"
            className={styles.input}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
        </label>
        <br />
        <label className={styles.label}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="패스워드를 입력하세요"
          />
        </label>
        <br />
        <button type="button" className={styles.button} onClick={handleLogin}>
          로그인
        </button>
      </form>
    </div>
  );
}
