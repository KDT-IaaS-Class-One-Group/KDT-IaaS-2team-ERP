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
        style={{
          padding: "8px",
          fontSize: "14px",
          width: "100%",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginTop: "1vh",
          marginBottom: "1vh"
        }}
      />
    </div>
  );
};

export default OrderInfoInput;
