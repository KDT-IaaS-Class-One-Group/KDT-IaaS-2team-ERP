'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const UserGraph = () => {
  const [monthlyUserData, setMonthlyUserData] = useState([]);

  useEffect(() => {
    // 서버에서 월별 가입자 수 데이터를 가져오는 API 호출
    axios.get('/api/userGraph')
      .then(response => {
        setMonthlyUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching monthly user data:', error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={monthlyUserData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="userCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UserGraph;