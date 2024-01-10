import React from "react";

const OrderProductsList = ({ orderProducts }) => {
  return (
    <div>
      <h2>주문 상품 목록</h2>
      <ul>
        {orderProducts.map((productId) => (
          <li key={productId}>Product ID: {productId}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderProductsList;