import React from "react";

const OrderDetailsList = ({ orderDetails }) => {
  return (
    <ul>
      {orderDetails.map((order) => (
        <li key={order.Order_Index}>
          수령인 이름: {order.order_name}, 수령인 전화번호:  {order.order_phone}, 배송지 정보: {order.address}, <br />
          구독 종류 : {order.name}, 구독 기간: {order.Subs_Start} ~ {order.Subs_End} <br />
          원두 종류 : {order.product_name}
        </li>
      ))}
    </ul>
  );
};

export default OrderDetailsList;