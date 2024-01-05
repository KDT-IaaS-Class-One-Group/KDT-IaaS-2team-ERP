'use client'

import React, { useState } from 'react';

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    try {
      // 간단한 유효성 검사
      if (!cardNumber || !expiryDate || !cvv) {
        alert('카드 정보를 모두 입력하세요.');
        return;
      }

      // 여기에서 서버로 결제 정보를 전송하는 API 호출 등을 수행해야 합니다.
      // 실제로는 결제 게이트웨이를 사용하는 것이 일반적입니다.

      // 결제 성공 시 처리 (예시: 주문 완료 페이지로 이동)
      alert('결제가 완료되었습니다.');
      // 예시로 홈페이지로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('결제 중 오류 발생:', error);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div>
        <label>카드 번호</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="카드 번호"
        />
      </div>
      <div>
        <label>유효기간</label>
        <input
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="MM/YY"
        />
      </div>
      <div>
        <label>CVV</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
        />
      </div>
      <button onClick={handlePayment}>결제하기</button>
    </div>
  );
}