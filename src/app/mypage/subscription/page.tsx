'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Index from '@/app/page';
import jwt, { JwtPayload } from 'jsonwebtoken';
import styles from "@/styles/mysub.module.scss"
interface DataItem {
  auto_renew: number;
  Product_Index:number,
  Product_Index2:number,
  Product_Index3:number,
  address:string,
  detailsaddress:string,
  postcode:string,
  productName1:string,
  productName2:string,
  productName3:string,
  status:number,
  order_name:string,
  order_phone:string,
}

interface UserInfo {
  userId: string;
  name: string;
  birthdate: string;
  phoneNumber: string;
  email: string;
  postcode: string;
  address: string;
  detailaddress: string;
  gender: string;
  cash: number;
}

export default function MyPagesub() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null); // Type it appropriately
  const [productData, setproductData] = useState<any>(null);
  const [subsStart, setSubsStart] = useState<string | null>(null);
  const [subsEnd, setSubsEnd] = useState<string | null>(null);
  const [data, setData]  = useState<DataItem | null>(null);
 

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedCashAmount, setSelectedCashAmount] = useState<number>(0);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState<boolean>(false);

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
        const { userId, name, birthdate, phoneNumber, email, postcode , address, detailaddress, gender ,cash} = decodedToken;

        const birthdateDate = new Date(birthdate);

      // 로컬 시간으로 변환된 문자열 얻기
        const birthdateLocalString = birthdateDate.toLocaleDateString();

        const userInformation: UserInfo = {
          userId,
          name,
          birthdate: birthdateLocalString,
          phoneNumber,
          email,
          postcode,
          address,
          detailaddress,
          gender,
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


  const handleCashSelection = (amount: number) => {
    setSelectedCashAmount(amount);
    setIsPaymentEnabled(true); // 선택한 금액이 있으면 결제 버튼을 활성화
  };

  const handlePayment = async () => {
    if (!userInfo || selectedCashAmount === 0) {
      console.error('사용자 정보 또는 선택된 캐쉬 금액이 유효하지 않습니다.');
      return;
    }

    const currentToken = token || '';
    try {
      // 서버로 결제 요청 보내기
      const response = await fetch('/api/addCash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          cashAmount: selectedCashAmount,
        }),
      });

      if (response.ok) {
        // 결제 성공 시 사용자 정보 다시 불러오기
        loadUserFromToken(currentToken);
        // 결제 후 초기화
        setSelectedCashAmount(0);
        setIsPaymentEnabled(false);
      } else {
        console.error('캐쉬 추가 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    } else {
      fetchSubscriptionData(storedToken);
    }
  }, []);

  const formatDateString = (dateString: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const fetchSubscriptionData = async (token: string) => {
  try {
    const response = await fetch('/api/mysubscription', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
    
      console.error('Error fetching subscription data:', response.statusText);
      return;
    }

    const data = await response.json();
    setSubscriptionData(data.subscriptionData);
  
    const products = [
      {
        Product_Index: data.Product_Index,
        productName: data.productName1,
      },
      {
        Product_Index: data.Product_Index2,
        productName: data.productName2,
      },
      {
        Product_Index: data.Product_Index3,
        productName: data.productName3,
      },
    ];

    console.log("확인", data)
    setData(data)
    setproductData(products);
    setSubsStart(formatDateString(data.Subs_Start));
    setSubsEnd(formatDateString(data.Subs_End));
  } catch (error) {
    console.error('Error fetching subscription data:', error);
  }
};

const cancelSubscription = async () => {
  try {
    const response = await fetch('/api/cancelsubscription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error canceling subscription:', response.statusText);
      return;
    }

    // Update subscriptionData after cancellation
    const updatedData = await response.json();
    console.log(updatedData)
    console.log('Subscription canceled successfully');

    // Show notification that subscription is canceled
    alert('구독이 갱신이 취소되었습니다! 다시 로그인해주세요.');
    logout();
    // Redirect to login page or perform any other necessary actions
    // router.push('/login');
  } catch (error) {
    console.error('Error canceling subscription:', error);
  }
};

const logout = () => {
  
  localStorage.removeItem('token'); 
};

  return (
    <div className={styles.root}>
      <div className={styles.subinfo}>
            <h1 className={`mb-4 text-xl md:text-2xl`}>현재 구독중인 상품</h1>

            {token && !subscriptionData && (
            <p>현재 구독 중인 상품이 없습니다.</p>
            )}
          
            {subscriptionData && (
              <div>
                {/* Render subscription data as needed */}
                <p>구독상품명: {subscriptionData.name}</p>
                <p>구독 상품 가격: {subscriptionData.price}</p>
                {/* Add more details based on your subscription data structure */}
              </div>
            )}

            {productData && productData.length > 0 && (
              <div>
                <h2>구독에 포함된 상품목록</h2>
                <ul>
                  {productData.map((product: any, index: number) => (
                    <li key={index}>
                      {/* Render product data as needed */}
                      <p>상품명: {product.productName}</p>
                      {/* Add more details based on your product data structure */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {subsStart && subsEnd && (
              <div>
                {/* Render subs_start and subs_end */}
                <p>구독 시작일: {subsStart}</p>
                <p>구독 종료일: {subsEnd}</p>
              </div>
            )}
      
    
            {data && data.auto_renew === 1 ? (
              <div>
                <p>현재 구독이 자동 갱신 중입니다.</p>
                <p>다음 결제일: {subsEnd && formatDateString(new Date(new Date(subsEnd).getTime() - 24 * 60 * 60 * 1000).toString())}</p>
                <button onClick={cancelSubscription}>구독 취소</button>
              </div>
            ) : (
              <p>현재 구독이 자동 갱신되고 있지 않습니다.</p>
            )}
      </div>

      <div className={styles.cashinfo}>
        <div className={styles.userinfo}>
          {/* 사용자 정보를 표시하는 부분 */}
          {userInfo && (
            <div>
              <p>이름: {userInfo.name}</p>
              <p>남은캐쉬: {userInfo.cash}</p>
            </div>
          )}
        </div>

        <div className={styles.addcash}>
            <p>캐쉬 추가</p>
            <select onChange={(e) => handleCashSelection(Number(e.target.value))}>
              <option value="0">선택하세요</option>
              <option value="5000">5,000원</option>
              <option value="10000">10,000원</option>
              <option value="30000">30,000원</option>
              <option value="50000">50,000원</option>
            </select>
            <button onClick={handlePayment} disabled={!isPaymentEnabled}>
              결제
            </button>
          </div>
        </div>
    </div>
  );
}