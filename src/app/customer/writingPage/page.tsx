"use client";
import React, { useState , useEffect } from "react";
import styles from "@/styles/test.module.scss";
import Link from "next/link";

export default function Page() {
  const [formData, setFormData] = useState({
    boardKey: "",
    userID:"",
    email: "",
    user_Index: 0,
    title: "",
    content: "",
    date: "",
    password: "",
    // image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      // 토큰을 '.'을 기준으로 세 부분으로 분리
      const tokenParts = token.split('.');
  
      // 페이로드는 Base64로 인코딩된 두 번째 부분
      const payload = JSON.parse(atob(tokenParts[1]));
  
      // 사용자 ID와 사용자 인덱스, 이메일 추출
      const userId = payload.userId;
      const userIndex = payload.user_Index;
      const userEmail = payload.email;
      console.log(userId)
      console.log(userIndex)
      console.log(userEmail)
      // 폼 데이터에 사용자 ID와 이메일 추가
      setFormData((prevData) => ({
        ...prevData,
        userID: userId,
        user_Index: userIndex,
        email: userEmail,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/customer/writingPage/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Board created successfully!");
      } else {
        console.error("Failed to create board");
      }
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <div>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.width} ${styles.margin}`}
          placeholder="Title"
        />
      </div>
      <div>
        <label htmlFor="contents">내용</label>
        <textarea
          name="content"
          id="contents"
          value={formData.content}
          onChange={handleChange}
          className={`${styles.width} ${styles.height}`}
          placeholder="Content"
        ></textarea>
      </div>
      <div>
        <label htmlFor="key">비밀번호</label>
        <input
          type="password"
          name="password"
          id="key"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Create Board</button>
      {/* 'testPage'로 이동하는 링크 */}
      <Link href="/customer">
        <button>Go back to Test Page</button>
      </Link>
    </form>
  );
}
