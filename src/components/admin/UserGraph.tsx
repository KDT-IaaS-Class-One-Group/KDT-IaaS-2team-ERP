'use client'

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const UserGraph = () => {
  const [dynamicGraphData, setDynamicGraphData] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState('timestamp');

  useEffect(() => {
    // 서버에서 동적 그래프 데이터를 가져오는 API 호출
    axios.get(`/api/userGraph?xAxis=${selectedXAxis}`)
      .then(response => {
        setDynamicGraphData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dynamic graph data:', error);
      });
  }, [selectedXAxis]);

  const handleXAxisChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedXAxis(event.target.value);
  };

  return (
    <div>
      <label>Select X-Axis:</label>
      <select value={selectedXAxis} onChange={handleXAxisChange}>
        <option value="timestamp">가입일자</option>
        <option value="birth">출생년도</option>
        <option value="gender">성별</option>
      </select>

      <ResponsiveContainer width="200%" height={400}>
        <BarChart data={dynamicGraphData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="userCount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserGraph;