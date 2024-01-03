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
  address: string;
  gender: string;
  cash: string;
}

export default function MyPagecash() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); 
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
        const { userId, name, birthdate, phoneNumber, email, address, gender, cash } = decodedToken;

        const birthdateDate = new Date(birthdate);

      // 로컬 시간으로 변환된 문자열 얻기
        const birthdateLocalString = birthdateDate.toLocaleDateString();

        const userInformation: UserInfo = {
          userId,
          name,
          birthdate: birthdateLocalString,
          phoneNumber,
          email,
          address,
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
    </main>
  );
}