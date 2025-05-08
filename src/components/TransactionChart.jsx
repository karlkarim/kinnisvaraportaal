// src/components/TransactionChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function TransactionChart({ data, region }) {
  if (!data?.length) return <p>Tehinguandmeid ei leitud.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Tehingute arv – {region}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="transaction_count"
            stroke="#f97316"
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionChart;
