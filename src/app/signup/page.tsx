'use client';

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styles from "@/styles/signup.module.scss";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation'
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
    birthdate: Date;
    phoneNumber: string;
    email: string;
    address: string;
    gender: string;
  }>({
    userId: signup.userId || '',
    password: signup.password || '',
    name: signup.name || '',
    birthdate: signup.birthdate ? new Date(signup.birthdate) : new Date(),
    phoneNumber: signup.phoneNumber || '',
    email: signup.email || '',
    address: signup.address || '',
    gender: signup.gender || '',
  });
  const router = useRouter()

  useEffect(() => {
    
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Date) => {
    if (event instanceof Date) {
      setFormData({
        ...formData,
        birthdate: event,
      });
    } else {
      // Otherwise, it's a regular input change
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
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
        router.push('/login')
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>
          아이디:
          <input type="text" name="userId" value={formData.userId} onChange={handleChange} className={styles.input} />
        </label>
        <br />
        <label className={styles.formLabel}>
          비밀번호:
          <input type="password" name="password" value={formData.password} onChange={handleChange} className={styles.input} />
        </label>
        <br />
        <label className={styles.formLabel}>
          이름:
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} />
        </label>
        <br />
        <label className={styles.formLabel}>
          생년월일:
          <DatePicker
            selected={formData.birthdate}
            onChange={(date: Date) => handleChange(date)}
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <br />
        <label className={styles.formLabel}>
          휴대폰번호:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={styles.input} />
        </label>
        <br />
        <label className={styles.formLabel}>
          이메일:
          <input type="text" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
        </label>
        <br />
        <label className={styles.formLabel}>
          주소:
          <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.input} />
        </label>
        <label className={styles.formLabel}>
          성별:
          <select name="gender" value={formData.gender} onChange={handleChange} className={styles.input}>
            <option value="">선택하세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </label>
        <br />
        <button type="submit" className={styles.button}>회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;