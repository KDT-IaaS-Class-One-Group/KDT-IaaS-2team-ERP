'use client'
import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/subproduct.module.scss"
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import Link from "next/link";

interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number; 
  imageUrl: string;
}


export default function Page() {
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
    fetchData();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.top}><Topbar /></div>
      <div className={styles.main}>
        <div className={styles.container}>
          {data.map((item, index) => (
            <div className={styles.card} key={index}>         
              <div className={styles.image}> 
                <Image fill={true} className={styles.image} src={item.imageUrl} alt={`Product ${index + 1}`} />
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
      </div>
    </div>
  );
}
