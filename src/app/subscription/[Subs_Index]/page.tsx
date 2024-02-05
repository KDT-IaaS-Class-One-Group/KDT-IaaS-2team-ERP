"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/subpage.module.scss";
import SwiperTest from "@/components/test/baslide";

interface SubscriptionClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
  size: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  imageUrl: string;
  sale_status: number;
}
interface Products {
  id: number;
  name: string;
  label: string;
  stock: number;
  imageUrl: string;
}

export default function SubscriptionClientSide() {
  const [data, setData] = useState<SubscriptionClientSideProps[]>([]);
  const [productList, setProductList] = useState<Product[]>([]); // Product 타입으로 변경
  const [selectedProducts, setSelectedProducts] = useState<Array<number>>([]);
  const [selectedProductImages, setSelectedProductImages] = useState(
    Array(data.length).fill("")
  );
  const [radioOptions, setRadioOptions] = useState<Products[]>([]); // 라디오 상자 옵션 데이터
  const Subs_Index = useParams();
  const [token, setToken] = useState<string | null>(null);
  const subs_index = Subs_Index.Subs_Index;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
        const productListResponse = await fetch("/api/products");
        const productListFromServer = await productListResponse.json();
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
    updatedSelectedProductImages[index] = getProductImageById(
      parseInt(e.target.value, 10)
    );
    setSelectedProductImages(updatedSelectedProductImages);
  };

  const getProductImageById = (productId: any) => {
    const selectedProduct = productList.find(
      (product) => product.id === productId
    );
    return selectedProduct ? selectedProduct.imageUrl : "";
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
      if (!token) {
        alert('로그인 후 이용해주세요')
        return;
      }

      // const decodedToken = JSON.parse(atob(token.split('.')[1]));

      // if (decodedToken.order_Index) {
      //   alert('이미 구독 중입니다.');
      //   window.location.href = '/';
      //   return;
      // }

      if (
        selectedProducts.length !==
        Math.floor(data.reduce((acc, item) => acc + item.size, 0))
      ) {
        alert("상품을 모두 선택하세요.");
        return;
      } else {
        window.location.href = `/order/${subs_index}?selectedProducts=${selectedProducts.join(
          ","
        )}`;
      }
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
    <div>
      <div className={styles.main}>
        {data.map((item, index) => (
          <div className={styles.subinfo} key={index}>
            <div className={styles.image}>
              <Image
                fill={true}
                className={styles.image}
                src={item.imageUrl}
                alt={`sub ${index + 1}`}
              />
            </div>
            <p>
              {item.Week} 주 / {item.Price}원
            </p>
            <p>일주일에 받는 원두 : {item.size} 개 </p>
            <p>구독 기간 종료일 : {calculateEndDate(item.Week)}</p>
          </div>
        ))}

        <div className={styles.choicebox}>
          <div className={styles.imageContainer}>
            {selectedProducts.map((productId, index) => (
              <div key={index} className={styles.imagebox}>
                <Image
                  src={getProductImageById(productId)}
                  fill
                  alt={`선택한 제품 ${index + 1}`}
                  style={{ borderRadius: "5%" }}
                />
              </div>
            ))}
          </div>

          {Array.from({
            length: Math.floor(data.reduce((acc, item) => acc + item.size, 0)),
          }).map((_, index) => (
            <div
              key={index}
              className={`${styles.input} ${styles.customSelect}`}
            >
              <select
                title="selectProduct"
                value={selectedProducts[index]}
                onChange={(e) => handleSelectChange(e, index)}
                className={styles.input}
              >
                <option value="">{`${index + 1}. 상품을 선택하세요`}</option>
                {productList
                  .filter((product) => {
                    // sale_status가 1인 경우만 필터링
                    return product.sale_status === 1;
                  })
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
              </select>
            </div>
          ))}

          <Link href="#">
            <button onClick={handleOrderButtonClick} className={styles.button}>
              주문하기
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.swiper}>
        <SwiperTest />
      </div>
    </div>
  );
}
