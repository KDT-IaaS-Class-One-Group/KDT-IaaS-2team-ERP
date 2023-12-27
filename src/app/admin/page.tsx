"use client"

import React from "react";
import { useState } from "react";

import  MenuTab  from  "@/components/MenuTab"
// import { LoginForm } from  "@/components/admin/LoginForm"



const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <h1>관리자 페이지</h1>
      <MenuTab />
    </>
  );
};

export default Admin;