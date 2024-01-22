import React from "react";
import styles from "@/styles/order.module.scss";

const OrderReceipt = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>
                  <h2> 상품 정보 </h2>

          <p>구독명: {item.Name}</p>
          <p>가격: {item.Price}</p>
          <p>기간: {item.Week}주</p>
        </div>
      ))}
    </div>
  );
};

export default OrderReceipt;
