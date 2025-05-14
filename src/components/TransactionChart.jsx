// src/components/TransactionChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const monthNames = [
  "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
  "Juuli", "August", "September", "Oktoober", "November", "Detsember"
];

function formatPeriodLabel(period) {
  if (!period) return "";
  const [year, month] = period.split("-");
  const monthName = monthNames[parseInt(month, 10) - 1] || month;
  return `${monthName} ${year}`;
}

function TransactionChart({ data, region }) {
  if (!data?.length) return <p>Tehinguandmeid ei leitud.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Tehingute arv – {region}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="period" tickFormatter={formatPeriodLabel} />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name === "transaction_count" ? "Tehingute arv" : name]}
            labelFormatter={formatPeriodLabel}
          />
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
