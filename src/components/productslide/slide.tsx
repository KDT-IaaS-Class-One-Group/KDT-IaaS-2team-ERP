import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '@/styles/productslide.module.scss'
import Image from 'next/image';


interface Product {
  name: string;
  info: string;
}

const SlideComponent: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProductData = async () => {
    try {
      const response = await fetch('/api/products');
      const dataFromServer: Product[] = await response.json();
      setProductData(dataFromServer);
    } catch (error) {
      console.error('데이터를 불러오는 도중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, 
    nextArrow: <div className={styles.slickarrownext}>Next</div>,
    prevArrow: <div className={styles.slickarrowprev}>Prev</div>,
  };

  const handleSlideClick = (index : number) => {
    // 슬라이드 클릭 시 선택된 상품 정보 갱신
    setSelectedProduct(productData[index]);
  };

  return (
    <div className={styles.containerStyle}>
      <Slider {...settings}>
        {productData.map((product, index) => (
          <div key={index} onClick={() => handleSlideClick(index)} className={styles.customslide}>
            <div className={styles.image} style={{width:"30vw",height:"45vh"}}> 
              <Image layout={"fill"} src={`/productimage/image${index+1}.jpg`} alt={`Product ${index + 1}`} />
            </div>
            <p style={{ margin: 0 }}>Name: {product.name}</p>
          </div>
        ))}
      </Slider>
      {selectedProduct && (
        <div className={styles.selectedproductinfo}>
          <p>Name: {selectedProduct.name}</p>
          <p>info: {selectedProduct.info}</p>
          {/* 기타 정보 표시 */}
        </div>
      )}
    </div>
  );
};

export default SlideComponent;

