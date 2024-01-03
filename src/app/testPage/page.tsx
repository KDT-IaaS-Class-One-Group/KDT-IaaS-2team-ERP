"use client";
import React, { useState } from "react";
import "@/styles/Modal.module.scss"; // 모달 스타일을 위한 CSS 파일 import

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>글쓰기</button>
        <button className="close-btn" onClick={closeModal}>
          닫기
        </button>
      {modalOpen && <div className="modal-overlay" onClick={closeModal}></div>}
      {modalOpen && <div className={`modal ${modalOpen ? "active" : ""}`} style={{ display: "block" }}>
        <h2>글쓰기</h2>
        <input type="text" placeholder="제목" />
        <br />
        <br />
        <textarea placeholder="내용" rows={4}></textarea>
        <br />
        <br />
        <button>등록</button>
      </div>}
    </div>
  );
};


export default Page;
