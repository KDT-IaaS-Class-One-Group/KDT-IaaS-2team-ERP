'use client'

import React, { useState, useEffect } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from '@/styles/order.module.scss'
import { useRouter ,useSearchParams } from 'next/navigation';

interface OrderClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
}

interface UserInfo {
  user_Index:number,
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  cash:number;
}

interface ProductClientSideProps {
  id: number;
  category: number;
  name: string;
}


export default function OrderClientSide() {
  const [data, setData] = useState<OrderClientSideProps []>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [Price, setPrice] = useState(0);
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Sub_Index;
  const router = useRouter();
  const searchParams = useSearchParams()
  const selectedProducts = searchParams.get('selectedProducts')
  console.log(selectedProducts)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productData, setProductData] = useState<ProductClientSideProps[]>([]);


  useEffect(() => {
    if (selectedProducts) {
      const ids = selectedProducts.split(',').map((id) => parseInt(id, 10));
      console.log(`ids = ${ids}`)
      setSelectedProductIds(ids);

      // 서버로 선택한 상품 정보 요청
      fetch(`/api/productss?productIds=${ids.join(',')}`)
        .then((response) => response.json())
        .then((productDataFromServer) => {
          console.log('Selected Products Data:', productDataFromServer);
          setProductData(productDataFromServer);
        })
        .catch((error) => console.error('상품 정보를 가져오는 도중 오류 발생:', error));
    }
  }, [selectedProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subscription/${subs_index}`);
        const dataFromServer = await response.json();
        setData(dataFromServer);
        console.log(dataFromServer);

        if (dataFromServer) {
          setPrice(dataFromServer[0].Price);
          console.log("Price set successfully:", dataFromServer[0].Price);
          console.log("Updated Price state:", Price)
        }else {
          console.log("No price data in the response:", dataFromServer);
        }
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    } else {
      // 토큰에서 사용자 정보를 읽어와서 화면에 표시
      loadUserFromToken(storedToken);
    }
  }, [router]);

  const loadUserFromToken = (token: string) => {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken) {
        const {user_Index,name, phoneNumber, email, address, cash } = decodedToken;

        const userInformation: UserInfo = {
          user_Index,
          name,
          phoneNumber,
          email,
          address,
          cash,
        };

        setUserInfo(userInformation);
      } else {
        console.error('토큰이 유효하지 않습니다.');
        // userInfo가 null인 경우 초기화
        setUserInfo(null);
      }
    } catch (error) {
      console.error('토큰 해석 오류:', error);
      // userInfo가 null인 경우 초기화
      setUserInfo(null);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.token, price: Price }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData); // 서버로부터의 응답 처리
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className={styles.receipt}>
          <p>Name: {item.Name}</p>
          <p>Price: {item.Price}</p>
          <p>Week: {item.Week}</p>
        </div>
      ))}

        {productData.map((product, productIndex) => (
           
              <div key={productIndex}>
                <p>Product Name: {product.name}</p>
                {/* 필요한 상품 정보 추가 */}
              </div>
            
          ))}


      <Link href={`/payment`}>
      <button onClick={handlePayment}>결제하기</button>
      </Link>


      <div className='myinfo'>
        {/* 사용자 정보를 표시하는 부분 */}
        {userInfo && (
          <div>
            <div>
                <p>이름: {userInfo.name}</p>
                <p>전화번호: {userInfo.phoneNumber}</p>
                <p>이메일: {userInfo.email}</p>
                <p>주소: {userInfo.address}</p>
            </div>
            <div>
            <p>나의 캐쉬:{userInfo.cash}</p>
            </div>
            </div>
            )}
      </div>
      </div>
  );
}