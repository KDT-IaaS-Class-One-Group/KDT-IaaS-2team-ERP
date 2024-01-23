"use client";

import React, { useState, useEffect } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useParams } from "next/navigation";
import styles from "@/styles/order.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import OrderInfoInput from "../../../components/subscription/OrderInfoInput";
import PaymentButton from "../../../components/subscription/PaymentButton";
import OrderedProductsList from "../../../components/subscription/OrderedProductsList";
import UserInfoDisplay from "../../../components/subscription/UserInfoDisplay";
import OrderReceipt from "../../../components/subscription/OrderReceipt";
import { Input } from "@chakra-ui/react";
import Search from "@/components/test/modal";

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
  postcode: string;
  address: string;
  detailaddress: string;
  cash: number;
  order_Index: number;
}

interface ProductClientSideProps {
  id: number;
  name: string;
  imageUrl: string;
}

export default function OrderClientSide() {
  const [data, setData] = useState<OrderClientSideProps[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [price, setPrice] = useState(0);
  const Subs_Index = useParams();
  const subs_index = Subs_Index.Subs_Index;
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedProducts = searchParams.get("selectedProducts");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productData, setProductData] = useState<ProductClientSideProps[]>([]);
  const [orderNameInput, setOrderNameInput] = useState("");
  const [orderPhoneInput, setOrderPhoneInput] = useState("");
  const [detailaddress, setDetailaddress] = useState<string>("");
  const [address, setaddress] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [selectedAddressType, setSelectedAddressType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedaddress, setSelectedaddress] = useState<string | null>(null);
  const [selectedZonecode, setSelectedZonecode] = useState<string | null>(null);

  const setsToken = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setaddress(event.target.value);
  };

  useEffect(() => {
    if (selectedProducts) {
      const ids = selectedProducts.split(",").map((id) => parseInt(id, 10));
      setSelectedProductIds(ids);

      // 서버로 선택한 상품 정보 요청
      fetch(`/api/productss?productIds=${ids.join(",")}`)
        .then((response) => response.json())
        .then((productDataFromServer) => {
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

        if (dataFromServer) {
          setPrice(dataFromServer[0].Price);
        } else {
          console.log("No price data in the response:", dataFromServer);
        }
      } catch (error) {
        console.error("데이터를 불러오는 도중 오류 발생:", error);
      }
    };
    fetchData();
  }, [subs_index, price]);

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
          postcode,
          detailaddress,
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
          postcode,
          detailaddress,
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
      // if (userInfo && userInfo.order_Index !== null) {
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
          Subs_Index: subs_index,
          price: price,
          ids: selectedProducts,
          postcode: selectedAddressType === 1 ? userInfo?.postcode : postcode,
          address: selectedAddressType === 1 ? userInfo?.address : address,
          detailaddress:
            selectedAddressType === 1 ? userInfo?.detailaddress : detailaddress,
          order_name:
            selectedAddressType === 1 ? userInfo?.name : orderNameInput,
          order_phone:
            selectedAddressType === 1 ? userInfo?.phoneNumber : orderPhoneInput,
        }),
      });

      if (!response.ok) {
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

      const updatedToken = await fetchUpdatedToken();

      if (updatedToken) {
        // 토큰 업데이트 및 로컬 스토리지에 저장
        setToken(updatedToken);
        localStorage.setItem("token", updatedToken);
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
      return newToken;
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생:", error);
      return null;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getaddress = (data: any) => {
    console.log(data);
    const address1 = data;
    return address1;
  };

  // 모달에서 주소를 선택했을 때 호출되는 함수
  const handleSelectaddress = (data: any) => {
    const address = getaddress(data);
    setSelectedaddress(address);
    setaddress(address);
    setIsModalOpen(false);
  };

  const handleSelectZonecode = (data: any) => {
    const postcodeData = getaddress(data);
    setSelectedZonecode(postcodeData);
    setPostcode(postcodeData);
  };

  return (
    <div className={styles.orderroot}>
      <h2> 주문 상품 </h2>
      <div className={styles.productbox}>
        <div className={styles.product}>
          <OrderedProductsList products={productData} />
        </div>
        <div className={styles.producttext}>
          <OrderReceipt data={data} />
        </div>
      </div>
      <h2> 주문자 정보 </h2>
      <div className={styles.userbox}>
        <UserInfoDisplay userInfo={userInfo} />
      </div>

      <h2 className={styles.deliveryInfoTitle}>배송지</h2>
      <div className={styles.delbox}>
        <div style={{ marginBottom: "2vh" }}>
          <input
            type="radio"
            id="addressType1"
            name="addressType"
            value={1}
            checked={selectedAddressType === 1}
            onChange={() => setSelectedAddressType(1)}
          />
          <label htmlFor="addressType1">기본 배송지</label>

          <input
            type="radio"
            id="addressType2"
            name="addressType"
            value={2}
            checked={selectedAddressType === 2}
            onChange={() => setSelectedAddressType(2)}
          />
          <label htmlFor="addressType2">신규 입력</label>
        </div>

        {/* 조건부로 배송지 정보 입력 표시 */}
        {selectedAddressType === 1 && (
          <>
            <OrderInfoInput
              label="이름"
              value={userInfo?.name || ""}
              onChange={setOrderNameInput}
            />
            <OrderInfoInput
              label="전화번호"
              value={userInfo?.phoneNumber || ""}
              onChange={setOrderPhoneInput}
            />
            <OrderInfoInput
              label="우편번호"
              value={userInfo?.postcode || ""}
              onChange={setPostcode}
            />
            <OrderInfoInput
              label="주소"
              value={userInfo?.address || ""}
              onChange={setaddress}
            />
            <OrderInfoInput
              label="상세주소"
              value={userInfo?.detailaddress || ""}
              onChange={setDetailaddress}
            />
          </>
        )}

        {selectedAddressType === 2 && (
          <>
            <OrderInfoInput
              label="이름"
              value={orderNameInput}
              onChange={setOrderNameInput}
            />

            <OrderInfoInput
              label="전화번호"
              value={orderPhoneInput}
              onChange={setOrderPhoneInput}
            />
            {/* 주소검색 */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                height: "4vh",
                width: "7vw",
                marginBottom: "1vh",
                marginTop: "2.5vh",
                cursor: "pointer",
                backgroundColor: "#D8D9DA",
                border: "0",
                borderRadius: "4px",
              }}
            >
              주소 검색
            </button>
            <Input
              name="postcode"
              type="text"
              placeholder="우편번호"
              value={postcode}
              style={{
                height: "4vh",
                width: "10vw",
                marginBottom: "1vw",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              readOnly
            />
            <Search
              open={isModalOpen}
              onClose={handleCloseModal}
              onSelectAddress={handleSelectaddress}
              onSelectZonecode={handleSelectZonecode}
            >
              모달 내용
            </Search>

            <Input
              type="text"
              name="address"
              placeholder="주소"
              value={address}
              onChange={handleAddressChange}
              style={{
                height: "4vh",
                width: "30vw",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              readOnly
            />
            <Input
              name="detailaddress"
              type="text"
              placeholder="상세주소"
              value={detailaddress}
              style={{
                height: "4vh",
                width: "30vw",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: "1vh",
              }}
              onChange={(e) => {
                setDetailaddress(e.target.value);
              }}
            />
          </>
        )}
      </div>
      <div>
        <PaymentButton onClick={handlePayment} />
      </div>
    </div>
  );
}
