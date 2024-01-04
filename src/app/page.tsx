"use client";

import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";
import Link from "next/link";

function Index() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch("/api/data");
        const dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    // fetchData 함수 호출
    fetchData();
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".swiper-container", {
      spaceBetween: 70,
      slidesPerView: 3,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
    });
  }, []);

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.gray}`}></div>
      <div className={`${styles.div} ${styles.blue}`} />
      <div className={`${styles.div} ${styles.yellow}`}>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {data.map((item, index) => (
              <div
                key={index}
                className={`swiper-slide ${styles.subscriptionItem}`}
                style={{
                  width: "30vw",
                  height: "80vh",
                  backgroundColor: "lightgray",
                  marginTop: "10vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <p style={{ margin: 0 }}>Name: {item.name}</p>
                <p style={{ margin: 0 }}>Price: {item.price}</p>
                <p style={{ margin: 0 }}>Week: {item.week}</p>
                <Link href={`/subscription/${item.Subs_Index}`}>
                  <button>자세히 보기</button>
                </Link>
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-scrollbar"></div>
        </div>
      </div>
      <div className={`${styles.div} ${styles.purple}`} />
    </div>
  );
}

export default Index;
