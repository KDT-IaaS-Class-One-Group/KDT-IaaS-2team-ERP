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
              <Link href={`/subscription/${item.Subs_Index}`}>
              <div className={styles.image}> 
                <Image fill={true} className={styles.image} src={item.imageUrl} alt={`Product ${index + 1}`} />
              </div>
              </Link>
              <p style={{ margin: 0 }}>{item.name}</p>
              <p style={{ margin: 0 }}>{item.price} 원</p>
              <p style={{ margin: 0 }}>{item.week} 주</p>
          </div> 
          ))}
        </div>
      </div>
    </div>
  );
}
