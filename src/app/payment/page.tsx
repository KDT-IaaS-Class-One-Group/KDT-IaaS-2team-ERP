'use client'

import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const OrderDetailsPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 토큰에서 user_Index 추출
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token not found');
          return;
        }

        const decodedToken = jwt.verify(token, 'nts9604');

        if (!decodedToken || !decodedToken.user_Index) {
          console.error('Invalid token or user index not found');
          return;
        }

        const userIndex = decodedToken.user_Index;

        // 서버에서 orderdetails 데이터를 가져오기
        const response = await fetch(`/api/orderdetails?userIndex=${userIndex}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrderDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 빈 배열은 페이지 로딩 시 한 번만 실행하도록 함

  return (
    <div>
      <h1>주문 상세 정보</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {orderDetails.map((order, index) => (
            <li key={index}>{`Order Index: ${order.Order_Index}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderDetailsPage;