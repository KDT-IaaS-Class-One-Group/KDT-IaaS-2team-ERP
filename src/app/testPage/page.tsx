"use client";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";

interface item {
  title: string;
  password: string;
  content: string;
}

export default function App() {
  const [data, setData] = useState({ title: "", content: "", password: "" });
  const [showContent, setShowContent] = useState(false); // 추가: 컨텐츠를 보여줄지 여부 상태
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    fetch("/testPage/getData") // 적절한 API 경로를 사용하여 데이터를 가져옵니다.
      .then((response) => response.json())
      .then((titles) => {
        setTitles(titles);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleTitleClick = (
    title: string,
    password: string,
    content: string
  ) => {
    const enteredPassword = prompt("암호를 입력하세요:");

    if (enteredPassword === password) {
      setData({ ...data, title: title, content: content });
      setShowContent(true);
    } else {
      alert("잘못된 암호입니다.");
    }
  };

  return (
    <div id="root">
      {titles.map((item: item, index: number) => (
        <h1
          key={index}
          onClick={() =>
            handleTitleClick(item.title, item.password, item.content)
          }
        >
          {item.title}
        </h1>
      ))}
      <Link href="/testPage/writingPage">
        <button>Go to Writing Page</button>
      </Link>
      {showContent && <p>내용 : {data.content}</p>}
    </div>
  );
}
