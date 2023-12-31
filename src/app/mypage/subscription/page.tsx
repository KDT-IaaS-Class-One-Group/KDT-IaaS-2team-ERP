'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Index from '@/app/page';

export default function MyPagesub() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null); // Type it appropriately
  const [productData, setproductData] = useState<any>(null);
  const [subsStart, setSubsStart] = useState<string | null>(null);
  const [subsEnd, setSubsEnd] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    } else {
      // Fetch subscription data using order_index and subs_index
      fetchSubscriptionData(storedToken);
    }
  }, [router]);

  const formatDateString = (dateString: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const fetchSubscriptionData = async (token: string) => {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch subscription data
   

    try {
      const response = await fetch('/api/mysubscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // You may need to pass additional parameters like order_index, subs_index in the URL or request body
      });

      if (!response.ok) {
        // Handle error if the API request is not successful
        console.error('Error fetching subscription data:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data)
      console.log(data.productdata)
      setSubscriptionData(data.subscriptionData)
      setproductData(data.productdata);
      setSubsStart(formatDateString(data.Subs_Start));
      setSubsEnd(formatDateString(data.Subs_End));
    } catch (error) {
      console.error('Error fetching subscription data:');
    }
  };

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        현재 구독중인 상품
      </h1>

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
          {productData.map((product:any , index : number) => (
            <li key={index}>
              {/* Render product data as needed */}
              <p>상품명: {product.product_name}</p>
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
    </main>
  );
}