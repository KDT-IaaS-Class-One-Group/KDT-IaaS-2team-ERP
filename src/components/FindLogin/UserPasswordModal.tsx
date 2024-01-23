// PasswordModal.tsx
import React, { useState } from "react";
import styles from "@/styles/customer.module.scss";

const UserPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const handleFindPassword = async () => {
    // 클라이언트에서 서버로 비밀번호 찾기 요청 보내기
    try {
      const response = await fetch("/api/find-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // 서버 응답이 성공이면
        if (data.password) {
          window.alert(`Password: ${data.password}`);
        } else {
          window.alert("User not found");
        }
      } else {
        // 서버 응답이 실패이면
        console.error("서버 응답 실패:", data.error);
      }
    } catch (error) {
      console.error("네트워크 에러:", error);
    }
  };
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
      <h1 className={styles.textLeft}>비밀번호 찾기</h1>
        <span className={styles.closeBtn} onClick={onClose}>
          &times;
        </span>
        {/* 비밀번호 찾기 모달 내용 */}
        <div className={styles.outline}>
        <div className={`${styles.margin} ${styles.textLeft} ${styles.font}`}>회원 비밀번호 찾기</div>
        <div className={styles.flexSet}>
        <div className={styles.marginRight}>
        <input type="text" className={styles.textBarSize} placeholder="ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <br />
        <input type="text" className={`${styles.marginTop} ${styles.textBarSize}`} placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className={styles.buttonSize} onClick={handleFindPassword}>Find Password</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UserPasswordModal;