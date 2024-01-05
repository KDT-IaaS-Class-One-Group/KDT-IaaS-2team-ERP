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
interface FormData {
  userId: string;
  password: string;
  name: string;
  birthdate: Date;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
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
  const [isUserIdValid, setIsUserIdValid] = useState<'unknown' | boolean | null>(null);
  const router = useRouter()

  useEffect(() => {
  
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Date) => {
    if (event instanceof Date) {
      // Date일 경우
      setFormData({
        ...formData,
        birthdate: event,
      });
    } else {
      // HTML 요소일 경우
      const target = event.target as HTMLInputElement | HTMLSelectElement;

      setFormData({
        ...formData,
        [target.name]: target.value,
      });

      if (target.name === 'userId') {
        // 아이디가 변경될 때, 중복 체크 상태 초기화
        setIsUserIdValid(null);
      }
    }
  };

  const handleCheckDuplicate = async () => {
    try {
      const url = new URL(`/api/signup/checkDuplicate/${formData.userId}`, window.location.origin);
      // formData를 URLSearchParams로 변환하여 쿼리 문자열로 추가
      Object.keys(formData).forEach(key => url.searchParams.append(key, (formData as any)[key]));
  
      const response = await fetch(url);
  
      console.log('Server Response:', response);
  
      const data = await response.json();
  
      setIsUserIdValid(!data.isDuplicate);
    } catch (error) {
      console.error('Error checking duplicate:', error);
      setIsUserIdValid(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isUserIdValid) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

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
          <button type="button" onClick={handleCheckDuplicate}>
          중복 확인
          </button>
          {isUserIdValid === null ? null : (
            <span className={styles.validMessage}>
              {isUserIdValid === true
                ? '사용 가능한 아이디입니다.'
                : isUserIdValid === false
                ? '이미 사용 중인 아이디입니다.'
                : '중복 확인 중...'}
            </span>
          )}
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
        <button type="submit" className={styles.button} disabled={isUserIdValid === false}>회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;