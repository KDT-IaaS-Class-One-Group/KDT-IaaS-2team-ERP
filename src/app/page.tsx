'use client';
import React, { useState, useEffect } from 'react';
import Swiper from 'swiper/bundle'; // Swiper를 전체 번들로 가져옵니다.
import 'swiper/swiper-bundle.css'; // Swiper 스타일을 불러옵니다.
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";
import Footbar from '@/components/Footer/Footer';
import SlideComponent from '@/components/productslide/slide';
import Link from "next/link";
import Image from 'next/image';
import Video from 'next-video';
import { usePathname , useRouter } from 'next/navigation';
import { relative } from 'path';


interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number; // 또는 실제 타입에 맞게 지정
}

function Index() {
  const [data, setData] = useState<DataItem[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch("/api/data");
        const dataFromServer = await response.json();
        console.log(dataFromServer)
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
      
      spaceBetween: 80,
      slidesPerView: 4,
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



 
    const [hasWindow, setHasWindow] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, [hasWindow]);

  return (
    <div className={styles.container}>
      <Topbar />
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
        <div className={styles.box1}>당신을 위한 <br/> 원두를 선택하세요!
        <button>원두 선택하기!</button>
        </div>
      </div>
      <div className={`${styles.div} ${styles.yellow}`}>
        <div className="swiper-container" style={{width: "90vw"}}>
          <div className="swiper-wrapper" style={{width: "90vw"}}>
            {data.map((item, index) => (
              <div
                key={index}
                className={`swiper-slide ${styles.subscriptionItem}`}
                style={{
                  width: "20vw",
                  height: "80vh",
                  backgroundColor: "#f6f1eb",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "4vw",
                  cursor: "pointer",
                }}
              >
                <div className={styles.image}> 
                  <Image layout={"fill"} src={`/image/image${index+1}.jpg`} alt={`Product ${index + 1}`} />
                </div>
                <p style={{ margin: 0 }}>Name: {item.name}</p>
                <p style={{ margin: 0 }}>Price: {item.price}</p>
                <p style={{ margin: 0 }}>Week: {item.week}</p>
                <Link href={`/subscription/${item.Subs_Index}`}>
                  <button>자세히 보기</button>
                  </Link>
              </div>
            ))}
          </div>
          <div className="swiper-button-next" style={{
                  top:'150vh'
                }}></div>
          <div className="swiper-button-prev"
          style={{
            top:'150vh'
          }}
          ></div>
          
        </div>
      </div>
      <div className={`${styles.div} ${styles.purple}`}>
        {/* <SlideComponent/> */}
      </div>
      <div className={`${styles.div} ${styles.blue}`} >
        <div className={styles.infobox1}></div>
        <div className={styles.infobox2}></div>
        <div className={styles.infobox3}></div>
        <div className={styles.infobox4}></div>
      </div>
      <Footbar/>
    </div>
  );
}

export default Index;
