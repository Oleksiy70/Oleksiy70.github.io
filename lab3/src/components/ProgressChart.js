import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ProgressChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const log = JSON.parse(localStorage.getItem('workoutLog') || '[]');
    const grouped = {};
    log.forEach(({ duration }) => {
      const date = new Date().toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + duration;
    });
    const chartData = Object.entries(grouped).map(([date, total]) => ({ date, total }));
    setData(chartData);
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#4a90e2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
