// Modal.tsx

import React from "react";
import styles from "@/styles/customer.module.scss";

interface ModalProps {
  title: string;
  content: string;
  reply: string;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, reply, closeModal }) => {

  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.closeBtn} onClick={closeModal}>
          &times;
        </span>
        <h2>제목 : {title}</h2>
        <p>내용 : {content}</p>
        <p>Reply: {reply}</p>
      </div>
    </div>
  );
};

export default Modal;
