'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
}

export default function MyPageinfo() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
        const { userId, name, birthdate, phoneNumber, email, postcode , address, detailaddress, gender } = decodedToken;

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

  const handleEditModeToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleSaveChanges = async () => {
    // 서버에 수정된 정보 전송 및 데이터베이스 업데이트 로직 추가
    
    if (!userInfo) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    const currentToken = token || '';
    try {
      const response = await fetch('/api/updateUser',{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },

        body: JSON.stringify({
          name: userInfo.name,
          birthdate: userInfo.birthdate,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,           
          address: userInfo.address,        
          gender: userInfo.gender,           
        }),
      });

      if (response.ok) {
        // 수정 모드 종료 및 변경된 사용자 정보 다시 불러오기
        setIsEditMode(false);

        const { token: newToken } = await response.json();

        // 새로운 토큰을 사용하여 로컬 상태 업데이트
        setToken(newToken);
  
        // 서버로부터 새로운 토큰을 발급받기
        const newTokenResponse = await fetch('/api/refreshToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`
          },
        });
  
        if (newTokenResponse.ok) {
          const { token: newToken } = await newTokenResponse.json();
          localStorage.setItem('token', newToken);
          // 새로운 토큰을 사용하여 사용자 정보를 다시 불러오기
          loadUserFromToken(newToken);

        } else {
          console.error('토큰 갱신 실패:', newTokenResponse.statusText);
        }
      } else {
        console.error('사용자 정보 업데이트 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setToken(null);
        router.push('/login');
      } else {
        console.error('회원 탈퇴 실패:', response.statusText);
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  };



  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        myinfo
      </h1>
      <div className='myinfo'>
        {/* 사용자 정보를 표시하는 부분 */}
        {userInfo && (
          <div>
            {/* 수정 모드일 때는 입력 폼을 표시 */}
            {isEditMode ? (
              <div>
                <p>사용자 ID: {userInfo.userId}</p>
                <label>
                  이름:
                  <input
                    type='text'
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo((prevInfo) => 
                        prevInfo ? { ...prevInfo, name: e.target.value } : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
                      )
                    }
                  />
                </label>
                <label>
                  생년월일:
                  <input
                    type='text'
                    value={userInfo.birthdate}
                    onChange={(e) =>
                      setUserInfo((prevInfo) => 
                        prevInfo ? { ...prevInfo, birthdate: e.target.value } : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
                      )
                    }
                  />
                </label>
                <label>
  전화번호:
  <input
    type='text'
    value={userInfo.phoneNumber}
    onChange={(e) =>
      setUserInfo((prevInfo) =>
        prevInfo
          ? { ...prevInfo, phoneNumber: e.target.value }
          : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
      )
    }
  />
</label>
<label>
  이메일:
  <input
    type='text'
    value={userInfo.email}
    onChange={(e) =>
      setUserInfo((prevInfo) =>
        prevInfo
          ? { ...prevInfo, email: e.target.value }
          : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
      )
    }
  />
</label>
<label>
  주소:
  <input
    type='text'
    value={userInfo.address}
    onChange={(e) =>
      setUserInfo((prevInfo) =>
        prevInfo
          ? { ...prevInfo, address: e.target.value }
          : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
      )
    }
  />
</label>
<label>
  성별:
  <input
    type='text'
    value={userInfo.gender}
    onChange={(e) =>
      setUserInfo((prevInfo) =>
        prevInfo
          ? { ...prevInfo, gender: e.target.value }
          : { userId: '', name: e.target.value, birthdate: '', phoneNumber: '', email: '',postcode:'', address: '', detailaddress:'' ,gender: '' }
      )
    }
  />
</label>

                {/* 나머지 수정 폼들도 추가 */}
                {/* ... */}
                <button onClick={handleSaveChanges}>저장</button>
              </div>
            ) : (
              <div>
                <p>사용자 ID: {userInfo.userId}</p>
                <p>이름: {userInfo.name}</p>
                <p>생년월일: {userInfo.birthdate}</p>
                <p>전화번호: {userInfo.phoneNumber}</p>
                <p>이메일: {userInfo.email}</p>
                <p>우편번호:{userInfo.postcode}</p>
                <p>주소: {userInfo.address}</p>
                <p>상세주소:{userInfo.detailaddress}</p>
                <p>성별: {userInfo.gender}</p>
                <button onClick={handleEditModeToggle}>수정</button>
              </div>
            )}
          </div>
        )}
      </div>

      <h1 className={`mb-4 text-xl md:text-2xl`}>
        회원탈퇴
      </h1>
      <div className="withdrawn">
        <button onClick={handleWithdrawal}>회원 탈퇴</button>
      </div>
    </main>
  );
}