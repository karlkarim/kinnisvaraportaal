// src/components/TransactionChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const monthNames = [
  "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
  "Juuli", "August", "September", "Oktoober", "November", "Detsember"
];

function formatPeriodLabel(period) {
  if (!period) return "";
  const [, month] = period.split("-");
  return monthNames[parseInt(month, 10) - 1] || month;
}

function TransactionChart({ data, region }) {
  if (!data?.length) return <p>Tehinguandmeid ei leitud.</p>;

  // Teisenda transaction_count numbriks
  const fixedData = data.map(d => ({
    ...d,
    transaction_count: Number(d.transaction_count)
  }));

  // Leia maksimum väärtus Y-telje jaoks
  const maxValue = Math.max(...fixedData.map(d => d.transaction_count), 0);

  return (
    <div className="mt-10 pb-8" style={{ overflow: 'visible' }}>
      <h2 className="text-xl font-semibold mb-2">Tehingute arv – {region}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={fixedData} wrapperStyle={{ overflow: 'visible' }} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis
            dataKey="period"
            interval={0}
            tick={({ x, y, payload }) => {
              const [year, month] = payload.value.split("-");
              return (
                <g transform={`translate(${x},${y + 10})`}>
                  <text x={0} y={0} textAnchor="end" fontSize={14} transform="rotate(-35)">
                    {monthNames[parseInt(month, 10) - 1]} {year}
                  </text>
                </g>
              );
            }}
          />
          <YAxis domain={[0, maxValue + 2]} />
          <Tooltip 
            formatter={(value, name) => [value, name === "transaction_count" ? "Tehingute arv" : name]}
            labelFormatter={formatPeriodLabel}
          />
          <Bar dataKey="transaction_count" fill="#f97316" barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionChart;
