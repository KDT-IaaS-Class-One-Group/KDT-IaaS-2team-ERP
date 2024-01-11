"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";

const RadioContainer = styled.div`
  margin-top: 20px;
`;

const StyledRadio = styled.input`
  margin-right: 8px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledSelect = styled.select`
  padding: 8px;
  font-size: 16px;
  margin-right: 10px;
`;

const StyledButton = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
const LeftContainer = styled.div`
  width: 50%; /* 왼쪽 컨테이너 너비 조절 */
`;

const RightContainer = styled.div`
  width: 40%; /* 오른쪽 컨테이너 너비 조절 */
`;
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
  const [radioOptions, setRadioOptions] = useState([]); // 라디오 상자 옵션 데이터
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Sub_Index;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
        // dataFromServer를 이용하여 product 테이블에서 상품 리스트를 가져옴
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

  useEffect(() => {
    const fetchRadioOptions = async () => {
      try {
        const response = await fetch("/api/radio-options"); // 실제 사용하시는 API 경로로 변경
        const dataFromServer = await response.json();
        setRadioOptions(dataFromServer);
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };

    fetchRadioOptions();
  }, []);

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
    } catch (error) {
      console.error("주문 요청 중 오류 발생:", error);
    }
  };

  return (
    <Container>
      <LeftContainer>
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
            data.reduce((acc, item) => acc + item.size, 0) /
              (data[0]?.Week || 1)
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
        ))}{" "}
      </LeftContainer>
      <RightContainer>
        <RadioContainer>
          <p>라디오 선택 상자</p>
          {radioOptions.map((option) => (
            <div key={option.id}>
              <StyledRadio
                type="radio"
                id={`option${option.id}`}
                name="options"
                value={option.id}
              />
              <label htmlFor={`option${option.id}`}>
                <div>{/* 이미지 추가할 자리입니다. */}</div>
                {option.label}
              </label>
            </div>
          ))}
        </RadioContainer>
      </RightContainer>
    </Container>
  );
}
