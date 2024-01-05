"use client";
import React, { useState } from "react";
import styles from "@/styles/test.module.scss";
import Link from "next/link";

export default function Page() {
  const [formData, setFormData] = useState({
    boardKey: "",
    User_index: "",
    title: "",
    content: "",
    date: "",
    password: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/testPage/writingPage/create-post', {
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
      <Link href="/testPage">
        <button>Go back to Test Page</button>
      </Link>
    </form>
  );
}
