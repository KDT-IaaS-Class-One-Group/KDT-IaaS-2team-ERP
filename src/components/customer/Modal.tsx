// 모달 컴포넌트 생성 (Modal.tsx)
import React from "react";
import styles from "@/styles/customer.module.scss";

interface ModalProps {
  title: string;
  content: string;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, closeModal }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <span className={styles.closeBtn} onClick={closeModal}>
          &times;
        </span>
        <h2>제목 : {title}</h2>
        <p>내용 : {content}</p>
      </div>
    </div>
  );
};

export default Modal;
