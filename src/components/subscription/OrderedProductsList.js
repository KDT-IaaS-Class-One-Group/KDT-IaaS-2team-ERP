import React from "react";

const OrderedProductsList = ({ products }) => {
  return (
    <div>
        {products.map((product, index) => (
          <div key={index}>
            <p>{product.name}</p>
          </div>
        ))}
    </div>
  );
};

export default OrderedProductsList;
