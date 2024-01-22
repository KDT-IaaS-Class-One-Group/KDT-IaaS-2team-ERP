"use client"
import {loadTossPayments} from '@tosspayments/payment-sdk'

export default function Page(){
  const handleClick = async () => {
    const tossPayments = await loadTossPayments(
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
    )

    await tossPayments.requestPayment('카드', {
      amount: 12000,
      orderId:Math.random().toString(36).slice(2),
      orderName:'구독',
      successUrl: `${window.location.origin}/api/payments`,
      failUrl:`${window.location.origin}/api/payments/fail`
    })
  }
  return(
    <div>
      <button onClick={handleClick}>구독 12000원</button>
    </div>
  )
}