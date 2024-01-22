"use client";
import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle"; // Swiper를 전체 번들로 가져옵니다.
import "swiper/swiper-bundle.css"; // Swiper 스타일을 불러옵니다.
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";
import Footbar from "@/components/Footer/Footer";
import Aboutus from "@/components/main/aboutus/aboutus";
import SlideComponent from "@/components/productslide/slide";
import Link from "next/link";
import Image from 'next/image';
import Video from 'next-video';
import { usePathname , useRouter } from 'next/navigation';
import { relative } from 'path';
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
  // const [data, setData] = useState<DataItem[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // API 호출
  //       const response = await fetch("/api/data");
  //       const dataFromServer = await response.json();
  //       console.log(dataFromServer)
  //       setData(dataFromServer);
  //     } catch (error) {
  //       console.error("데이터를 불러오는 도중 오류 발생:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const swiper = new Swiper(".swiper-container", {
      
  //     spaceBetween: 80,
  //     slidesPerView: 4,
  //     navigation: {
  //       nextEl: ".swiper-button-next",
  //       prevEl: ".swiper-button-prev",
  //     },
  //     pagination: {
  //       el: ".swiper-pagination",
  //       clickable: true,
  //     },
  //     scrollbar: {
  //       el: ".swiper-scrollbar",
  //       draggable: true,
  //     },
  //   });
  // }, []);



 
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
            src={require("../../public/video/배경테스트.mp4")}
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
