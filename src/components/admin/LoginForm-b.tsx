"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/login.module.scss";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

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

      router.push("/admin/dashboard");
      setIsLoggedIn(true);
    } else {
      // 로그인 실패
      alert("로그인 실패!");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>로그인</h1>
      <form className={styles.form}>
        <label className={styles.label}>
          아이디:
          <input
            type="text"
            className={styles.input}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <br />
        <label className={styles.label}>
          비밀번호:
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" className={styles.button} onClick={handleLogin}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
