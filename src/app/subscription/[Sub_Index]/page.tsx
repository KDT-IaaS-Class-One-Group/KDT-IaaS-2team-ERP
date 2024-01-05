'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
interface SubscriptionClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
}

export default function SubscriptionClientSide() {
  const [data, setData] = useState<SubscriptionClientSideProps[]>([]);
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Sub_Index;
  console.log(subs_index)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer= await response.json();
        console.log(dataFromServer)
        setData(dataFromServer);
      } catch (error) {
        console.error('데이터를 불러오는 도중 오류 발생:', error);
      }
    };

    
      fetchData();

  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
          <p>Name: {item.Name}</p>
          <p>Price: {item.Price}</p>
          <p>Week: {item.Week}</p>
        </div>
      ))}
      <Link href={`/order`}>
                 <button>주문하기</button>
     </Link>
    </div>
  );
}
