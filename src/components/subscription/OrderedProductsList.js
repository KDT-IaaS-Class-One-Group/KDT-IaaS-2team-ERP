import React from "react";

const OrderedProductsList = ({ products }) => {
  return (
    <div>
      <h2>주문한 상품 목록</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderedProductsList;