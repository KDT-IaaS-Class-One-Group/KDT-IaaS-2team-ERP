"use client";
import styles from "@/styles/login.module.scss";
import React, { useState } from "react";
import UsernameModal from "@/components/FindLogin/UserIdModal";
import UserPasswordModal from "@/components/FindLogin/UserPasswordModal";
import Link from "next/link";

const Login: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        const { token, name } = data;
        localStorage.setItem("token", token);
        // sessionStorage.setItem('name', name);
        console.log("로그인 성공");

        window.location.href = "/";
      } else {
        // 로그인 실패
        alert("아이디나 비밀번호가 틀렸습니다.")
        console.error('로그인 실패:', data.error);
      }
    } catch (error) {
      console.error("서버 에러:", error);
    }
  };

  const handleOpenUsernameModal = () => {
    setShowUsernameModal(true);
  };

  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
  };

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h1 className={styles.h1}>로그인</h1>
        <form className={styles.form}>
          <label className={styles.label}>
            <input type="text" className={styles.input} value={userId} placeholder="아이디를 입력하세요" onChange={(e) => setUserId(e.target.value)} />
          </label>
          <br />
          <label className={styles.label}>
            <input type="password" className={styles.input} value={password} placeholder="비밀번호를 입력하세요" onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button type="button" className={styles.button} onClick={handleLogin}>
            로그인
          </button>
          
          <button type="button" className={styles.button2}>
          <Link href={`/signup`}>
            회원가입
          </Link>
          </button>
        </form>
        <br />
      <div>
      <button type="button" className={styles.FindInfo} onClick={handleOpenUsernameModal}>아이디 찾기</button>
      <button type="button" className={styles.FindInfo} onClick={handleOpenPasswordModal}>비밀번호 찾기</button>
      </div>
      {showUsernameModal && (
        <div className="modal">
          <div className="modal-content">
            <UsernameModal onClose={handleCloseUsernameModal} />
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <UserPasswordModal onClose={handleClosePasswordModal} />
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Login;
