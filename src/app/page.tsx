'use client'

import React, { useState, useEffect } from 'react';
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
  }, []);  // 두 번째 매개변수로 빈 배열을 전달하여 최초 렌더링 시에만 실행되도록 설정

  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.blue}`} />
      <div className={`${styles.div} ${styles.yellow}`}>
        <div className={`${styles.sliderContainer}`}>
          {data.map((item, index) => (
            <div key={index} className={styles.subscriptionItem}>
              <p>Name: {item.name}</p>
              <p>Price: {item.price}</p>
              <p>Week: {item.week}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.div} ${styles.purple}`} />
    </div>
  );
}

export default Index;