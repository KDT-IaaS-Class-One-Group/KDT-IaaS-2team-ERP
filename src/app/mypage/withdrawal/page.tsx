'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyPagewithdrawal() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    }
  }, [router]);

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
        회원탈퇴
      </h1>
      <div className="withdrawn">
        <button onClick={handleWithdrawal}>회원 탈퇴</button>
      </div>
    </main>
  );
}
