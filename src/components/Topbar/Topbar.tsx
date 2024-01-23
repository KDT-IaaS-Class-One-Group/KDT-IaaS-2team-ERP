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
    window.location.href = '/';
  };


  return (
    <div className={styles.topbar}>
      <div className={styles.div1}><TopNav/></div>
      <div className={styles.div2}>
        <Link href="/" >NTS</Link>
      </div>
      <div className={styles.div3}>
        {isLoggedIn ? (
          <>
            <p>{`${name} 님`}</p>
            <Link href="/mypage/myinfo" >MYPAGE</Link>
            <button className={styles.link} onClick={handleLogout}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link className={styles.link} href="/signup">SIGN UP</Link>
            <Link className={styles.link} href="/login">LOGIN</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
