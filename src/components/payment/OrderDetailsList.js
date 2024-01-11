import React from "react";

const OrderDetailsList = ({ orderDetails }) => {
  return (
    <ul>
      {orderDetails.map((order) => (
        <li key={order.Order_Index}>
          Order_Index: {order.Order_Index}, order_name: {order.order_name}, address: {order.address}
        </li>
      ))}
    </ul>
  );
};

export default OrderDetailsList;