"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
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
        localStorage.setItem('token', token);
        console.log('로그인 성공');
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
    <div>
      <h2>로그인</h2>
      <input type="text" placeholder="사용자 ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default LoginForm;