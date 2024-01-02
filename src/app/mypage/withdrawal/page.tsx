'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

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



  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        회원탈퇴
      </h1>
    </main>
  );
}
