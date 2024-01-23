// UsernameModal.tsx
import React, { useState } from "react";
import styles from "@/styles/customer.module.scss";

const UserIdModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [output, setOutput] = useState<string>('');
  const [isOutputVisible, setIsOutputVisible] = useState<boolean>(false);

  const handleFindUsername = async () => {
    // 클라이언트에서 서버로 아이디 찾기 요청 보내기
    try {
      const response = await fetch("/api/find-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // 서버 응답이 성공이면
        if (data.userId) {
          setOutput(`ID: ${data.userId}`);
          setIsOutputVisible(true);
        } else {
          window.alert("회원정보가 존재하지 않습니다.");
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
          <h1 className={styles.textLeft}>아이디 찾기</h1>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        
        {/* 아이디 찾기 모달 내용 */}
        <div className={styles.outline}>
          {/* isOutputVisible 상태에 따라 동적으로 스타일 적용 */}
          <div className={isOutputVisible ? styles.hidden : ''}>
            {/* 기존의 태그들 */}
            <div className={`${styles.margin} ${styles.textLeft} ${styles.font}`}>회원 아이디 찾기</div>
            <div className={styles.flexSet}>
              <div className={styles.marginRight}>
                <input type="text" className={styles.textBarSize} placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <input type="text" className={`${styles.marginTop} ${styles.textBarSize}`} placeholder="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <button className={styles.buttonSize} onClick={handleFindUsername}>Find Username</button>
            </div>
          </div>

          {/* 출력을 보여줄지 여부에 따라 동적으로 스타일 적용 */}
          <h3 className={`${styles.centeredContainer} ${isOutputVisible ? '' : styles.hidden}`}>
            아이디 찾기가 완료되었습니다.
          <h2>{output}</h2>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UserIdModal;
