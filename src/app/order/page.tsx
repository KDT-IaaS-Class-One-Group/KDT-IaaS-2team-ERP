'use client'

import React, { useState } from 'react';
const jwt = require('jsonwebtoken');

export default function Page() {


  const decodedToken = jwt.decode(localStorage.token);
  // 클레임 추출
  const user_index = decodedToken.index;
  const userId = decodedToken.userId;

  return (
    <div>
      {userId}
      {user_index}
    </div>
  );
}