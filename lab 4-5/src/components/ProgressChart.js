import {
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function ProgressChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} unit=" кг" />
          <Tooltip formatter={(value) => `${value} кг`} />
          <Line type="monotone" dataKey="weight" stroke="#4a90e2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
