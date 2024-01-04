"use client";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";

export default function App() {
  const [data, setData] = useState({ title: "", content: "", password: "" });

  useEffect(() => {
    fetch("/testPage/getData") // 적절한 API 경로를 사용하여 데이터를 가져옵니다.
      .then((response) => response.json())
      .then((data) => {
        const postData = data[0]; // 데이터는 배열의 첫 번째 요소에 있을 것입니다.
        setData(postData); // 가져온 데이터를 상태에 설정합니다.
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleTitleClick = () => {
    const enteredPassword = prompt("암호를 입력하세요:");

    if (enteredPassword === data.password) {
      alert(`Contents: ${data.content}`);
    } else {
      alert("잘못된 암호입니다.");
    }
  };
  
  return (
    <div id="root">
      <h1 onClick={handleTitleClick}>{data.title}</h1>
      <Link href="/testPage/writingPage">
        <button>Go to Writing Page</button>
      </Link>
    </div>
  );
}
