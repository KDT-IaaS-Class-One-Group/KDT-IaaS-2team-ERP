"use client";

import React from "react";
import LoginForm from "@/components/admin/LoginForm-b";

export default function Admin() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10vh",
      }}
    >
      <LoginForm />
    </div>
  );
}
