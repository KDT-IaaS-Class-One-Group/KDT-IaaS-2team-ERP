"use client";

import React, { useState, useEffect } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "@/styles/order.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import OrderInfoInput from "../../../components/subscription/OrderInfoInput";
import PaymentButton from "../../../components/subscription/PaymentButton";
import OrderedProductsList from "../../../components/subscription/OrderedProductsList";
import UserInfoDisplay from "../../../components/subscription/UserInfoDisplay";
import OrderReceipt from "../../../components/subscription/OrderReceipt";

interface OrderClientSideProps {
  Subs_Index: number;
  Name: string;
  Price: number;
  Week: number;
}

interface UserInfo {
  User_Index: number;
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  cash: number;
  order_Index: number;
}

interface ProductClientSideProps {
  id: number;
  category: number;
  name: string;
}

export default function OrderClientSide() {
  const [data, setData] = useState<OrderClientSideProps[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [Price, setPrice] = useState(0);
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Sub_Index;
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedProducts = searchParams.get("selectedProducts");
  console.log(selectedProducts);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productData, setProductData] = useState<ProductClientSideProps[]>([]);
  const [addressInput, setAddressInput] = useState("");
  const [orderNameInput, setOrderNameInput] = useState("");
  const [orderPhoneInput, setOrderPhoneInput] = useState("");
  const [zipCodeInput, setZipCodeInput] = useState("");

  const setsToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
  };

  useEffect(() => {
    if (selectedProducts) {
      const ids = selectedProducts.split(",").map((id) => parseInt(id, 10));
      console.log(`ids = ${ids}`);
      setSelectedProductIds(ids);

      // 서버로 선택한 상품 정보 요청
      fetch(`/api/productss?productIds=${ids.join(",")}`)
        .then((response) => response.json())
        .then((productDataFromServer) => {
          console.log("Selected Products Data:", productDataFromServer);
          setProductData(productDataFromServer);
        })
        .catch((error) =>
          console.error("상품 정보를 가져오는 도중 오류 발생:", error)
        );
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
          console.log("Updated Price state:", Price);
        } else {
          console.log("No price data in the response:", dataFromServer);
        }
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    } else {
      // 토큰에서 사용자 정보를 읽어와서 화면에 표시
      loadUserFromToken(storedToken);
    }
  }, [router]);

  const loadUserFromToken = (token: string) => {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken) {
        const {
          User_Index,
          userId,
          name,
          phoneNumber,
          email,
          address,
          cash,
          order_Index,
        } = decodedToken;

        const userInformation: UserInfo = {
          User_Index,
          userId,
          name,
          phoneNumber,
          email,
          address,
          cash,
          order_Index,
        };

        setUserInfo(userInformation);
      } else {
        console.error("토큰이 유효하지 않습니다.");
        // userInfo가 null인 경우 초기화
        setUserInfo(null);
      }
    } catch (error) {
      console.error("토큰 해석 오류:", error);
      // userInfo가 null인 경우 초기화
      setUserInfo(null);
    }
  };

  const handlePayment = async () => {
    try {
      // if (userInfo && userInfo.User_Index !== null) {
      //   console.log("이미 구독 중입니다.");
      //   alert("이미 구독 중입니다.");
      //   router.push("/");
      //   return;
      // }

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.token,
          sub_index: subs_index,
          price: Price,
          ids: selectedProducts,
          address: addressInput,
          user_Index: userInfo?.User_Index,
          order_name: orderNameInput, // 주문자 이름 추가
          order_phone: orderPhoneInput, // 주문자 전화번호 추가
          zip_code: zipCodeInput, // 우편번호 추가
        }),
      });

      console.log(
        "Request Data:",
        JSON.stringify({
          token: localStorage.token,
          sub_index: subs_index,
          price: Price,
          ids: selectedProducts,
        })
      );

      if (!response.ok) {
        // 400 에러가 발생하면 수동으로 페이지 이동하거나 에러 처리를 할 수 있습니다.
        if (response.status === 400) {
          // 수동으로 페이지 이동
          router.push("/400-error-page");
        } else {
          // 다른 에러 상태 코드의 경우에 대한 처리
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return;
      }

      const responseData = await response.json();
      console.log(responseData); // 서버로부터의 응답 처리

      const updatedToken = await fetchUpdatedToken();

      if (updatedToken) {
        // 토큰 업데이트 및 로컬 스토리지에 저장
        setToken(updatedToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUpdatedToken = async () => {
    try {
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.token,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { newToken } = await response.json();
      console.log(`newtoken:${newToken}`);
      return newToken;
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생:", error);
      return null;
    }
  };

  return (
    <div>
      <OrderReceipt data={data} />

      <OrderedProductsList products={productData} />

      <UserInfoDisplay userInfo={userInfo} />

      <h2> 배송지 정보 입력 </h2>
      <OrderInfoInput
        label="수령자 이름"
        value={orderNameInput}
        onChange={setOrderNameInput}
      />

      <OrderInfoInput
        label="수령자 전화번호"
        value={orderPhoneInput}
        onChange={setOrderPhoneInput}
      />

      <OrderInfoInput
        label="주소"
        value={addressInput}
        onChange={setAddressInput}
      />

      <OrderInfoInput
        label="우편번호"
        value={zipCodeInput}
        onChange={setZipCodeInput}
      />
      <PaymentButton onClick={handlePayment} />
    </div>
  );
}
