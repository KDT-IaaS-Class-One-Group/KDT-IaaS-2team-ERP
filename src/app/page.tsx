"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  }, []); // 두 번째 매개변수로 빈 배열을 전달하여 최초 렌더링 시에만 실행되도록 설정

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.blue}`} />
      <div className={`${styles.div} ${styles.yellow}`}>
        <Slider
          className={styles.sliderContainer}
          slidesToShow={3} // 한 화면에 보여질 슬라이드 개수
          slidesToScroll={1} // 한 번에 스크롤할 슬라이드 개수
          infinite={false} // 무한 루프 여부
          speed={500} // 슬라이드 전환 속도 (밀리초 단위)
          dots={true}
          arrows={true}
        >
          {data.map((item, index) => (
            <div key={index} className={styles.subscriptionItem}>
              <p>Name: {item.name}</p>
              <p>Price: {item.price}</p>
              <p>Week: {item.week}</p>
            </div>
          ))}
        </Slider>
      </div>
      <div className={`${styles.div} ${styles.purple}`} />
    </div>
  );
}
export default Index;
