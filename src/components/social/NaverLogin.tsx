import React, { useState, useEffect } from 'react';

const NaverLogin: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // 서버에서 사용자 정보를 가져오는 함수
    const fetchUser = async () => {
      try {
        const response = await fetch('/user'); // 서버의 /user 엔드포인트로 사용자 정보 요청
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUser();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  const handleNaverLogin = () => {
    // 네이버 소셜 로그인을 위한 로직을 추가
    // 예: window.location.href = '네이버 소셜 로그인 URL';
  };

  return (
    <div>
      {user ? (
        <div>
          <p>로그인 성공!</p>
          <p>사용자 이름: {user.displayName}</p>
          {/* 사용자 정보 중 필요한 부분을 표시할 수 있습니다. */}
        </div>
      ) : (
        <button onClick={handleNaverLogin}>네이버 소셜 로그인</button>
      )}
    </div>
  );
};

export default NaverLogin;