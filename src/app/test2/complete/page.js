import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
export default function PaymentComplete() {
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState(null);
  const orderId = searchParams.get("orderId")
  const paymentKey = searchParams.get("paymentKey")
  const amount = searchParams.get("amount");
  const secretKey = process.env.TOSS_SECRET_KEY || "";
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

  useEffect(() => {
    async function fetchData() {
     
      try {
        // 결제 정보 가져오기
        const paymentsResponse = await fetch(`https://api.tosspayments.com/v1/payments/orders/${orderId}`,
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
            "Content-Type": "application/json",
          }
        });
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);

        const secretKey= process.env.TOSS_SECRET_KEY
        
        const url = "https://api.tosspayments.com/v1/payments/confirm"
        const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");

        // 결제 확인 보내기
        const confirmPaymentResponse = await fetch(url, {
            method: 'post',
            body:JSON.stringify({
            orderId,
            paymentKey: paymentKey, // 여기에 적절한 paymentKey를 전달해야 합니다.
            amount: amount,  // 여기에 적절한 amount를 전달해야 합니다.
          }),
        });

        const confirmData = await confirmPaymentResponse.json();
        console.log('Payment confirmation result:', confirmData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [orderId]);

  if (!payments) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>결제가 완료되었습니다.</h1>
      <ul>
        <li>결제상품 {payments.orderName}</li>
        <li>주문번호 {payments.orderID}</li>
        <li>결제금액 {payments.amount}</li>
      </ul>
    </div>
  );
}