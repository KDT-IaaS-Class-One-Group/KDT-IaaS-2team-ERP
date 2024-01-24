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
  user_name:string,
  user_phone:string,
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

  const loadUserFromToken = async (token: string) => {
    try {
      const decodedToken = jwt.decode(token) as JwtPayload;

      if (decodedToken) {
        const { User_Index, userId, name, birthdate, phoneNumber, email, postcode , address, detailaddress, gender } = decodedToken;
  
        // 서버에서 사용자 정보를 가져오기 위한 요청 생성
        const userResponse = await fetch(`/api/cashInfo?userIndex=${User_Index}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
  
          const userInfomation: UserInfo = {
            userId,
            name: userData.name,
            cash: userData.cash,
            birthdate: userData.birthdate,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            postcode: userData.postcode,
            address: userData.address,
            detailaddress: userData.detailaddress,
            gender: userData.gender,
          };
        setUserInfo(userInfomation);
      } else {
        console.error('사용자 정보를 가져오는데 실패했습니다:', userResponse.statusText);
        setUserInfo(null);
      }
    } else {
      console.error('유효하지 않은 토큰입니다.');
      setUserInfo(null);
    }
  } catch (error) {
    console.error('토큰 해독 오류:', error);
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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
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

    const updatedData = await response.json();
    alert('구독 서비스가 종료일에 해지됩니다. 다시 로그인해주세요.');
    logout();
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
            <h2 className={styles.title}>구독중인 서비스</h2>
            {token && !subscriptionData && (
            <p className={styles.title}>현재 구독 중인 서비스가 없습니다.</p>
            )}
            {subscriptionData && (
              <div>
                <p>{subscriptionData.name}</p>
                <p>{subscriptionData.week}주 / {subscriptionData.price}원</p>
              </div>
            )}

            {subsStart && subsEnd && (
              <div>
                <p>구독 시작일: {subsStart}</p>
                <p>구독 종료일: {subsEnd}</p>
              </div>
            )}
      
    
            {data && data.auto_renew === 1 ? (
              <div>
                <p>{subsEnd && formatDateString(new Date(new Date(subsEnd).getTime() - 24 * 60 * 60 * 1000).toString())}에 결제 예정</p>
                <button className={styles.btn} onClick={cancelSubscription}>구독 취소</button>
              </div>
            ) : (
              <p>{subsEnd}에 서비스 해지 예정</p>
            )}
      </div>
      <div className={styles.productinfo}>
        {productData && productData.length > 0 && (
          <>
            <h2 className={styles.title}>구독 상품 목록</h2>
            <ul>
              {productData.map((product: any, index: number) => (
                // productName이 null이 아닌 경우에만 렌더링
                product.productName && (
                  <li key={index}>
                    <p>{product.productName}</p>
                  </li>
                )
              ))}
            </ul>
          </>
        )}
      </div>
      <div className={styles.cashinfo}>
          {userInfo && (
            <div>
              <h3>{userInfo.name} 님</h3>
              <p>나의 캐쉬 : {userInfo.cash}</p>
            </div>
          )}

        <div className={styles.addcash}>
            <h3>캐쉬 충전</h3>
            <select onChange={(e) => handleCashSelection(Number(e.target.value))}>
              <option value="0">선택하세요</option>
              <option value="5000">5,000원</option>
              <option value="10000">10,000원</option>
              <option value="30000">30,000원</option>
              <option value="50000">50,000원</option>
            </select>
            <button className={styles.btn} onClick={handlePayment} disabled={!isPaymentEnabled}>
              결제
            </button>
          </div>
        </div>
    </div>
  );
}