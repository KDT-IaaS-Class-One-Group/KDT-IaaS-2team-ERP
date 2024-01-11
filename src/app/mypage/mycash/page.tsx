'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken';
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
export default function MyPagecash() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); 
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


  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        mycash
      </h1>
      <div className='mycashinfo'>
        {/* 사용자 정보를 표시하는 부분 */}
        {userInfo && (
          <div>
            <p>이름: {userInfo.name}</p>
            <p>남은캐쉬: {userInfo.cash}</p>
          </div>
        )}
      </div>

      <div>
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
    </main>
  );
}