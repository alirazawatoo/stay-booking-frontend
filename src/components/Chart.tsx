import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#000000'];

const Chart: React.FC<{ data: { user_type: string }[] }> = ({ data }) => {
  const countsByType = data.reduce<Record<string, number>>((counts, user) => {
    counts[user.user_type] = (counts[user.user_type] || 0) + 1;
    return counts;
  }, {});
  const chartData = Object.entries(countsByType).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
