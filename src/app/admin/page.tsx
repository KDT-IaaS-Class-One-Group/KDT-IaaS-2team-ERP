"use client"

import React from "react";
import  LoginForm  from  "@/components/admin/LoginForm-b"

export default function Admin () {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop:'15vh' }}>
      <h1>NTS Admin</h1>
        <LoginForm />
    </div>
  );
};