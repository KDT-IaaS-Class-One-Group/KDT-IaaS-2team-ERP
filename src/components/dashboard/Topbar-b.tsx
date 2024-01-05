'use client'

import React, { useState, useEffect } from "react";
import styles from "@/styles/admintopbar.module.scss";
import Link from "next/link";
import jwt, { JwtPayload } from 'jsonwebtoken';
import TopNav from "@/components/dashboard/Topnav-b"

function Topbar() {

  const handleDiv1Click = () => {
    // 관리자 홈페이지로 이동
    window.location.href = '/admin/dashboard';
  };
  return (
    <div className={styles.topbar}>
      <div className={styles.div1} onClick={handleDiv1Click}>NTS Admin</div>
      <div className={styles.div2}>
      <TopNav/>
      </div>
    </div>
  );
}

export default Topbar;
