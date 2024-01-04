'use client'

import React, { useState, useEffect } from "react";

function Subscription() {
  const [data, setData] = useState([]);
  console.log(data[0]);
  const test = data[0];
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 호출
        const response = await fetch(`/api/data`);
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
      <p>Name: {test.name}</p>
      <p>Price: {test.price}</p>
      <p>Week: {test.week}</p>
    </div>
  );
}

export default Subscription;