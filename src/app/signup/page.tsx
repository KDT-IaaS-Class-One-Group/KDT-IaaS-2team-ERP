'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import router from 'next/router';

interface SignUpProps {
  signup?: {
    userId?: string;
    password?: string;
    name?: string;
    birthdate?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    gender?: string;
  };
}

const SignUp: NextPage<SignUpProps> = ({ signup = {} }) => {
  const [formData, setFormData] = useState<{
    userId: string;
    password: string;
    name: string;
    birthdate: string;
    phoneNumber: string;
    email: string;
    address: string;
    gender: string;
  }>({
    userId: signup.userId || '',
    password: signup.password || '',
    name: signup.name || '',
    birthdate: signup.birthdate || '',
    phoneNumber: signup.phoneNumber || '',
    email: signup.email || '',
    address: signup.address || '',
    gender: signup.gender || '',
  });

  useEffect(() => {
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/signup/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.message === '회원가입 성공') {
        router.push('/success');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>
          유저 아이디:
          <input type="text" name="userId" value={formData.userId} onChange={handleChange} />
        </label>
        <br />
        <label>
          비밀번호:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <label>
          이름:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          생년월일:
          <input type="text" name="birthdate" value={formData.birthdate} onChange={handleChange} />
        </label>
        <br />
        <label>
          휴대폰번호:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </label>
        <br />
        <label>
          이메일:
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          주소:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </label>
        <label>
          성별:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </label>
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;