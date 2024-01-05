"use client"
import React, { useState, ChangeEvent } from 'react';
import styles from "@/styles/service-b.module.scss"

interface SubscriptionInfo {
  productIndex: string;
  name: string;
  price: string;
  week: string;
}

export default function Service() {
  return (
    <>
    <div className={styles.container}>
      <h1>구독 서비스 관리</h1>
      <button onClick={() => setShowForm(!showForm)}>구독 상품 추가</button>
      {showForm && (
        <div>
          <label>
            Product Index:
            <input type="text" name="productIndex" value={subscriptionInfo.productIndex} onChange={handleChange} />
          </label>
          <label>
            Name:
            <input type="text" name="name" value={subscriptionInfo.name} onChange={handleChange} />
          </label>
          <label>
            Price:
            <input type="text" name="price" value={subscriptionInfo.price} onChange={handleChange} />
          </label>
          <label>
            Week:
            <input type="text" name="week" value={subscriptionInfo.week} onChange={handleChange} />
          </label>
          <button onClick={handleSubmit}>추가</button>
        </div>
      )}
      </div>
    </>
  );
}
