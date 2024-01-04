'use client';

import React, { useState, useEffect } from 'react';
import Swiper from 'swiper/bundle'; // Swiper를 전체 번들로 가져옵니다.
import 'swiper/swiper-bundle.css'; // Swiper 스타일을 불러옵니다.
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";

function Index() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch('/api/data');
        const dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error('데이터를 불러오는 도중 오류 발생:', error);
      }
    };

    // fetchData 함수 호출
    fetchData();
  }, []);

  useEffect(() => {
    // Swiper 초기화
    const swiper = new Swiper('.swiper-container', {
      // 여기에 Swiper 옵션을 추가하세요
      spaceBetween: 70,
      slidesPerView:  3,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
    });
  }, [data]); // 데이터가 업데이트될 때마다 Swiper를 초기화합니다.

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.blue}`} />
      <div className={`${styles.div} ${styles.yellow}`}>
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {data.map((item, index) => (
              <div
                key={index}
                className={`swiper-slide ${styles.subscriptionItem}`}
                style={{
                  width: '30vw', // 슬라이드 너비
                  height: '80vh', // 슬라이드 높이
                  backgroundColor: 'lightgray', // 슬라이드 배경색
                  marginTop: '10vh', // 위쪽 margin
                  
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center', // 텍스트 수직 가운데 정렬
                  alignItems: 'center', // 텍스트 수평 가운데 정렬
                }}
              >
                <p style={{ margin: 0 }}>Name: {item.name}</p>
                <p style={{ margin: 0 }}>Price: {item.price}</p>
                <p style={{ margin: 0 }}>Week: {item.week}</p>
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
