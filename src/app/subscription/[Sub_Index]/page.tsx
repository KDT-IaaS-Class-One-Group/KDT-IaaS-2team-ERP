"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SubscriptionClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
  size: number;
}

interface Product {
  id: number;
  name: string;
  category: number;
  stock: number;
}

export default function SubscriptionClientSide() {
  const [data, setData] = useState<SubscriptionClientSideProps[]>([]);
  const [productList, setProductList] = useState<Product[]>([]); // Product 타입으로 변경
  const [selectedProducts, setSelectedProducts] = useState<Array<number>>([]);
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Sub_Index;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
        console.log(dataFromServer);
        // dataFromServer를 이용하여 product 테이블에서 상품 리스트를 가져옴
        const productListResponse = await fetch("/api/products");
        const productListFromServer = await productListResponse.json();
        console.log(productListFromServer);
        const productNames = productListFromServer.map(
          (product: any) => product.name
        );
        console.log(productNames);
        setProductList(productListFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    fetchData();
  }, [subs_index]);

  // 상품 선택 시 실행되는 함수
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = parseInt(e.target.value, 10); // 선택된 상품의 id를 숫자로 변환하여 저장
    setSelectedProducts(updatedSelectedProducts);
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
      // 선택된 상품이 없으면 경고 표시
      if (
        selectedProducts.length !==
        Math.floor(
          data.reduce((acc, item) => acc + item.size, 0) / (data[0]?.Week || 1)
        )
      ) {
        alert("상품을 모두 선택하세요.");
        return;
      } else {
        window.location.href = `/order/${subs_index}?selectedProducts=${selectedProducts.join(
          ","
        )}`;
      }
      // 'api/order'로 POST 요청 보내기
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
      {data.map((item, index) => (
        <div key={index}>
          <p>Name: {item.Name}</p>
          <p>Price: {item.Price}</p>
          <p>배송받는 기간!: {item.Week} 주</p>
          <p>일주일에 받는 원두: {item.size / item.Week} 개 </p>
          <p>구독 기간 종료일: {calculateEndDate(item.Week)}</p>
          <Link href="#">
            <button onClick={handleOrderButtonClick}>주문하기</button>
          </Link>
        </div>
      ))}

      {Array.from({
        length: Math.floor(
          data.reduce((acc, item) => acc + item.size, 0) / (data[0]?.Week || 1)
        ),
      }).map((_, index) => (
        <select
          key={index}
          value={selectedProducts[index]}
          onChange={(e) => handleSelectChange(e, index)}
          className="styles.input"
        >
          <option value="">상품을 선택하세요</option>
          {productList.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
