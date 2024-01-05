// import React, { useState, useEffect, useRef } from 'react';
// import Swiper from 'swiper';
// import 'swiper/swiper-bundle.css';


// const SlideComponent = () => {
//   const [productData, setProductData] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const swiperRef = useRef(new Swiper('.swiper-container'));
  
//   const fetchProductData = async () => {
//     try {
//       const response = await fetch('/api/products');
//       const dataFromServer = await response.json();
//       setProductData(dataFromServer);
//     } catch (error) {
//       console.error('데이터를 불러오는 도중 오류 발생:', error);
//     }
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, []);
//   useEffect(() => {
//   const initSwiper = () => {
//     const swiper = new Swiper('.swiper-container', {
//       loop: true,
//       spaceBetween: 90,
//       slidesPerView: 1,
//       navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//       },
//       pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//         renderBullet: function (index, className) {
//           return `<span class="${className}">${index + 1}</span>`;
//         },
//       },
//       scrollbar: {
//         el: '.swiper-scrollbar',
//         draggable: true,
//       },
//     });
    

//     swiper.on('slideChange', () => {
      
//     });

//     swiperRef.current = swiper;
//   };
// }, [productData]);


//   const handleSlideClick = (index : any) => {
//     // 슬라이드 클릭 시 선택된 상품 정보 갱신
//     setSelectedProduct(productData[index]);
//   };

//   return (
//     <div className="swiper-container" style={{ width: '30vw', height: '80vh' }}>
//       <div className="swiper-wrapper" style={{ width: '30vw', height: '80vh',}}>
//         {productData.map((product, index) => (
//           <div
//             key={index}
//             className="swiper-slide"
//             onClick={() => handleSlideClick(index)}
//           >
//             <p style={{ margin: 0 }}>Name: {product.name}</p>
//           </div>
//         ))}
//       </div>
//       <div className="swiper-pagination" style={{ top: '380vh' }}></div>
//       <div className="swiper-button-next" style={{ top: '350vh', right: '20vw' }}></div>
//       <div className="swiper-button-prev" style={{ top: '350vh' }}></div>
//       <div className="swiper-scrollbar" style={{ top: '380vh' }}></div>

//       {selectedProduct && ( 
//         <div className="selected-product-info" style={{width:'10vw', height:'20vh',color:'white'}}>
//           <p>Name: {selectedProduct.name}</p>
//           <p>Stock: {selectedProduct.stock}</p>
//           {/* 기타 정보 표시 */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SlideComponent;