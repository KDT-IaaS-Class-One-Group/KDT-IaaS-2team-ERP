"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import styles from "@/styles/subpage.module.scss"

interface SubscriptionClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
  size: number;
  imageUrl:string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  imageUrl:string;
}
interface Products{
  id: number;
  name: string;
  label: string;
  stock: number;
  imageUrl:string;
}


export default function SubscriptionClientSide() {
  const [data, setData] = useState<SubscriptionClientSideProps[]>([]);
  const [productList, setProductList] = useState<Product[]>([]); // Product 타입으로 변경
  const [selectedProducts, setSelectedProducts] = useState<Array<number>>([]);
  const [selectedProductImages, setSelectedProductImages] = useState(Array(data.length).fill(''));
  const [radioOptions, setRadioOptions] = useState<Products[]>([]); // 라디오 상자 옵션 데이터
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Subs_Index;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
        const productListResponse = await fetch("/api/products");
        const productListFromServer = await productListResponse.json();
        console.log(productListFromServer)
        const productNames = productListFromServer.map(
          (product: any) => product.name
        );
        setProductList(productListFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    fetchData();
  }, [subs_index]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = parseInt(e.target.value, 10);
    setSelectedProducts(updatedSelectedProducts);

    const updatedSelectedProductImages = [...selectedProductImages];
    console.log(updatedSelectedProductImages)
    updatedSelectedProductImages[index] = getProductImageById(parseInt(e.target.value, 10));
    setSelectedProductImages(updatedSelectedProductImages);
  };

  const getProductImageById = (productId : any) => {
    const selectedProduct = productList.find(product => product.id === productId);
    console.log(selectedProduct)
    return selectedProduct ? selectedProduct.imageUrl : ''; 
  };

  const calculateEndDate = (weeks: number): string => {
    const currentDate = new Date();
    const endDate = new Date(
      currentDate.setDate(currentDate.getDate() + weeks * 7)
    );
    return endDate.toLocaleDateString();
  };

  const handleOrderButtonClick = async () => {
    try {
      if (selectedProducts.length !== Math.floor(data.reduce((acc, item) => acc + item.size, 0) ))  {
        alert("상품을 모두 선택하세요.");
        return;
      }else{
        window.location.href = `/order/${subs_index}?selectedProducts=${selectedProducts.join(',')}`;}
      const response = await fetch(`/api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: selectedProducts,
        }),
      });
  
      if (response.ok) {
        console.log("주문 성공!");
      } else {
        console.error("주문 실패:", response.statusText);
      }
    } catch (error) {
      console.error("주문 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.main}>
      {data.map((item, index) => (
        <div className={styles.subinfo} key={index}>
          <div className={styles.image}> 
            <Image fill={true} className={styles.image} src={item.imageUrl} alt={`sub ${index + 1}`} />
          </div>
          <p>Name: {item.Name}</p>
          <p>Price: {item.Price}</p>
          <p>배송받는 기간: {item.Week} 주</p>
          <p>일주일에 받는 원두: {item.size} 개 </p>
          <p>구독 기간 종료일: {calculateEndDate(item.Week)}</p>
        </div>
      ))}
      
         <div className={styles.choicebox}>
        {Array.from({ length: Math.floor(data.reduce((acc, item) => acc + item.size, 0)) }).map((_, index) => (
          <div key={index}>
            <select
              title="selectProduct"
              value={selectedProducts[index]}
              onChange={(e) => handleSelectChange(e, index)}
              className={styles.input}
            >
              <option value="">상품을 선택하세요</option>
              {productList.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {selectedProductImages[index] && (
              <div className={styles.imagebox}>
                <Image src={selectedProductImages[index]} fill alt={`선택한 제품 ${index + 1}`} />
              </div>
            )}
          </div>
        ))}
        
        <Link href="#">
          <button onClick={handleOrderButtonClick}>주문하기</button>
        </Link>
        </div>
    </div>
  );
}