'use client'

import React, { useState } from 'react';
const jwt = require('jsonwebtoken');
import Link from "next/link";
import axios from 'axios';

export default function Page() {

  // 임시로 물건값 설정
  const price = 33333;

  const decodedToken = jwt.decode(localStorage.token, price );
  // 클레임 추출
  const user_index = decodedToken.index;
  const userId = decodedToken.userId;
  const userCash = decodedToken.cash;

  const handlePayment = async () => {
  try {
    const response = await axios.post('/api/payment', { token: localStorage.token, price });
    console.log(response.data); // 서버로부터의 응답 처리
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <div>
      {userCash}
      </div>
      <div>
      물건값 : {price}
      </div>
      <Link href={`/payment`}>
      <button onClick={handlePayment}>결제하기</button>
      </Link>
    </div>
  );
}