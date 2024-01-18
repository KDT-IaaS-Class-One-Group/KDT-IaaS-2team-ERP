import React from "react";
import Image from 'next/image';

const OrderedProductsList = ({ products }) => {
  return (
    <div>
        {products.map((product, index) => (
          <div key={index}>
            <p>{product.name}</p>
            <div className="imagebox">
              <Image src={product.imageUrl} width={250}
              height={200} alt={`선택한 제품 ${index + 1}`}></Image>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderedProductsList;
