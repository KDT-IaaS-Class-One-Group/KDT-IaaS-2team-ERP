// Modal.tsx

import React, { useEffect, useState } from "react";
import styles from "@/styles/customer.module.scss";

interface ModalProps {
  title: string;
  content: string;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, closeModal }) => {
  const [reply, setReply] = useState<string>("");

  useEffect(() => {
    fetchReplyData();
  }, []); // 페이지 로딩 시에만 실행

  const fetchReplyData = async () => {
    try {
      const response = await fetch("/customer/getData"); // 서버의 엔드포인트 경로 확인 필요
      const data = await response.json();
      if (data && data.length > 0) {
        // 서버로부터 받아온 데이터 중 reply 부분 가져오기
        setReply(data[0].reply);
      }
    } catch (error) {
      console.error("Error fetching reply data:", error);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeBtn} onClick={closeModal}>
          &times;
        </span>
        <h2>제목 : {title}</h2>
        <p>내용 : {content}</p>
        <p>답변: {reply}</p>
      </div>
    </div>
  );
};

export default Modal;
