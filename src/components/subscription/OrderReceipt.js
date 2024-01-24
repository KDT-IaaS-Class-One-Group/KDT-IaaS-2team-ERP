import React from "react";
import styles from "@/styles/order.module.scss";

const OrderReceipt = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <>
          <div key={index}>
            <h3>{item.Name}</h3>
            <p>
              기간 : {item.Week}주
            </p>
            <p>
              가격 : {item.Price}원
            </p>
          </div>
        </>
      ))}
    </div>
  );
};

export default OrderReceipt;
