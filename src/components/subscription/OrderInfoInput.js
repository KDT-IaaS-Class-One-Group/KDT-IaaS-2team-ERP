import React from "react";

const OrderInfoInput = ({ label, value, onChange }) => {
  return (
    <div>
      <label htmlFor={label}>{label}:</label>
      <input
        type="text"
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default OrderInfoInput;