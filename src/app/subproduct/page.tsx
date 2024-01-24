"use client";
import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/subproduct.module.scss";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number;
  imageUrl: string;
  sale_status: number;
}

export default function Page() {
  const [data, setData] = useState<DataItem[]>([]);
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
    fetchData();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <Topbar />
      </div>
      <div className={styles.main}>
        <div className={styles.container}>
          {data.map((item, index) => (
            <div
              className={styles.card}
              key={index}
              style={{ display: item.sale_status !== 1 ? "none" : "block" }}
            >
              <Link href={`/subscription/${item.Subs_Index}`}>
                <div className={styles.image}>
                  <Image
                    fill={true}
                    className={styles.image}
                    src={`${item.imageUrl}`}
                    alt={`${item.name}`}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
