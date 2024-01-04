'use client'

import React, { useState, useEffect } from "react";

function Subscription() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch(`/api/test/:subs_index`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    // fetchData 함수 호출
    fetchData();
  }, []);

  return (
    <div>
      <h1>Subscription</h1>
      <p>Name: {data.name}</p>
      <p>Price: {data.price}</p>
      <p>Week: {data.week}</p>
    </div>
  );
}

export default Subscription;