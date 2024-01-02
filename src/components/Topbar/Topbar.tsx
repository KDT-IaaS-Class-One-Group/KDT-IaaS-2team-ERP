'use client'

import React, { useState, useEffect } from "react";
import styles from "@/styles/topbar.module.scss";
import Link from "next/link";
import jwt, { JwtPayload } from 'jsonwebtoken';
import TopNav from "@/components/Topbar/topnav"

function Topbar() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState<string | JwtPayload>('');

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem('token');

      if (token) {
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (decodedToken) {
          const userName = decodedToken.name;
          setIsLoggedIn(true);
          setName(userName);
        }
      } else {
        setIsLoggedIn(false);
        setName('');
      }
    };

    loadUserFromToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setName('');
  };

  const handleDiv1Click = () => {
    // 홈페이지로 이동
    window.location.href = '/';
  };
  return (
    <div className={styles.topbar}>
      <div className={styles.div1} onClick={handleDiv1Click}>NTS</div>
      <div className={styles.div2}>
      <TopNav/>
      </div>
      <div className={styles.div3}>
        
        {isLoggedIn ? (
          <>
            <p>{`${name}님 환영합니다.`}</p>
            <Link href="/mypage">마이페이지</Link>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link className={styles.link} href="/signup">SignUp</Link>
            <Link className={styles.link} href="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
