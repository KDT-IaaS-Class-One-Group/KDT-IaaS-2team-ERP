'use client';
import styles from "@/styles/login.module.scss";
import React, { useState } from 'react';
import SocialLogin from '../../components/social/SocialLogin';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        const { token, name } = data;
        localStorage.setItem('token', token);
        // sessionStorage.setItem('name', name);
        console.log('로그인 성공');
        
        window.location.href = '/';
      } else {
        // 로그인 실패
        console.error('로그인 실패:', data.error);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };

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
      <SocialLogin />
    </div>
  );
};

export default Login;
