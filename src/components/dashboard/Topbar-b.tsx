"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/admintopbar.module.scss";
import TopNav from "@/components/dashboard/Topnav-b";
import jwt, { JwtPayload } from "jsonwebtoken";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState<string | JwtPayload>("");

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (decodedToken) {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    loadUserFromToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/admin";
    setName("");
  };

  const handleDiv1Click = () => {
    // 관리자 홈페이지로 이동
    window.location.href = "/admin/dashboard/user/user-info";
  };
  return (
    <div className={styles.topbar}>
      <div className={styles.div1} onClick={handleDiv1Click}>
        NTS <br></br>Admin
      </div>
      <div className={styles.div2}>
        <TopNav />
      </div>
      <div className={styles.div3}>
        <button className={styles.logout} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
