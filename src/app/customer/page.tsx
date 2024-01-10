"use client";
import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/customer.module.scss"
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";

interface item {
  boardKey: number;
  title: string;
  password: string;
  content: string;
  userID: string;
}

export default function Page() {
  const [data, setData] = useState<item>({
    boardKey: 0,
    title: "",
    password: "",
    content: "",
    userID: "",
  });
  const [showContent, setShowContent] = useState(false); // 추가: 컨텐츠를 보여줄지 여부 상태
  const [titles, setTitles] = useState([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
       // 토큰을 localStorage에서 가져오기
       const token = localStorage.getItem('token');

       if (token) {
         // 토큰을 '.'을 기준으로 세 부분으로 분리
         const tokenParts = token.split('.');
   
         // 페이로드는 Base64로 인코딩된 두 번째 부분
         const payload = JSON.parse(atob(tokenParts[1]));
   
         // 사용자 ID 추출
         const userId = payload.userId;
         setUserId(userId); // 추출한 사용자 ID 상태에 저장
       }
    fetch("/customer/getData") // 적절한 API 경로를 사용하여 데이터를 가져옵니다.
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

  const handleGoToWritingPage = () => {
    // Check if the user is logged in (token exists)
    const token = localStorage.getItem('token');

    if (token) {
      // If the token exists, navigate to the writing page
      window.location.href = "/customer/writingPage";
    } else {
      // If the token doesn't exist, show an alert
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.top}><Topbar /></div>
      <div className={styles.main}>
      {titles.map((item: item, index: number) => (
        <p
          key={index}
          onClick={() =>
            handleTitleClick(item.title, item.password, item.content)
          }
        >
        글번호: {item.boardKey} 글제목: {item.title} , 작성자:{item.userID}
        </p>
      ))}
      <p>사용자 ID: {userId}</p>
      <button onClick={handleGoToWritingPage}>Go to Writing Page</button>
      {showContent && <p>내용 : {data.content}</p>}
      </div>
    </div>
  );
}