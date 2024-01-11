import React, { useState, useEffect, useRef} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, Autoplay , Parallax} from 'swiper/modules';
import SwiperCore  from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import styles from '@/styles/baslide.module.scss'


interface Product {
  id: number;
  name: string;
  info: string;
}


export default function SwiperTest() {
 
  
  
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  SwiperCore.use([Navigation, Scrollbar, Autoplay, Parallax]);
  const swiperRef = useRef<SwiperCore>();
  const fetchProductData = async () => {
    try {
      const response = await fetch('/api/products');
      const dataFromServer: Product[] = await response.json();
      console.log(dataFromServer)
      setProductData(dataFromServer);
    } catch (error) {
      console.error('데이터를 불러오는 도중 오류 발생:', error);
    }
  };
  useEffect(() => {
    fetchProductData();
   
  }, []);

  const handleSlideClick = (index : number) => {
    // 슬라이드 클릭 시 선택된 상품 정보 갱신
    setSelectedProduct(productData[index]);
  };
  
  return (
    <div className={styles.swipercontainer}>
      <Swiper
        onSwiper={(swiper) =>{
          // swiperRef.current = swiper;
          setTimeout(() => {
            swiper.update(); 
          }, 1000);
        }}
        modules={[Navigation, Scrollbar,Parallax,]}
        className={styles.swiperslider}

        spaceBetween={50} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        navigation={true} // prev, next button
        parallax
        observeParents
        observer={true}
        
        autoplay={{
          delay: 2500,
      // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
      >
        {productData.map((product, index) => {
          return(
          <SwiperSlide key={product.id} className={styles.card}>          
            <div className={styles.image} onClick={() => handleSlideClick(index)} style={{width:"35vw",height:"45vh"}}> 
              <Image fill={true} src={`/productimage/image${index+1}.jpg`} alt={`Product ${index + 1}`} />
            </div>
          </SwiperSlide>
          );
          })}
      </Swiper>
      {selectedProduct && (
        <div className={styles.selectedproductinfo}>
          <p>Name: {selectedProduct.name}</p>
          <p>info: {selectedProduct.info}</p>
          {/* 기타 정보 표시 */}
        </div>
      )}
    </div>
  );
}