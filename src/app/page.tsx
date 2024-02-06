"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";
import Footbar from "@/components/Footer/Footer";
import Aboutus from "@/components/main/aboutus/aboutus";
import Link from "next/link";
import SwiperTest from '@/components/test/baslide';
import SubSwiper from '@/components/test/subslide';
interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number; // 또는 실제 타입에 맞게 지정
  imageUrl: string;
}

function Index() {
    const [hasWindow, setHasWindow] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, [hasWindow]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
      <Topbar />
      </div>
      <div className={`${styles.div} ${styles.gray}`}>
        {hasWindow && (
          <video
            className={styles.video}
            autoPlay={true}
            muted={true}
            loop={true}
            controls src="/video/배경테스트.mp4"
          />
        )}
        <div className={styles.box1}>
          NTS와 함께하는 <br></br>HOME CAFE 생활
          <Link href={`/subproduct`}>
          <button>지금 바로 구독하기</button>
          </Link>
        </div>
      </div>
      <div className={`${styles.div} ${styles.yellow}`}>
        <SubSwiper></SubSwiper>
      </div>
      <div className={`${styles.div} ${styles.purple}`}>
        {/* <SlideComponent/> */}
        <SwiperTest/>
      </div>
      <div className={`${styles.div} ${styles.blue}`}>
        <Aboutus/>
      </div>
      <Footbar />
    </div>
  );
}

export default Index;
