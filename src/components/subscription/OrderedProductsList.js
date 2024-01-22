import React from "react";
import Image from 'next/image';

const OrderedProductsList = ({ products }) => {
  return (
    <div style={{ display: 'flex' }}>
        {products.map((product, index) => (
          <div key={index} style={{ marginRight: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 auto' }}>{product.name}</p>
            <div className="imagebox">
              <Image src={product.imageUrl} width={250} height={200} alt={`선택한 제품 ${index + 1}`} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderedProductsList;