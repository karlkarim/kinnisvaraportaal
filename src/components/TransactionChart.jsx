// src/components/TransactionChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatPeriodLabel(period) {
  if (!period) return "";
  const [year, month] = period.split("-");
  return `${month}/${year.slice(-2)}`;
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
    <div>
      <h2 className="text-xl font-semibold mb-2">Tehingute arv</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={fixedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis
            dataKey="period"
            interval={window.innerWidth < 640 ? 2 : 0}
            tick={({ x, y, payload }) => {
              return (
                <g transform={`translate(${x},${y + 10})`}>
                  <text
                    x={0}
                    y={0}
                    textAnchor="end"
                    fontSize={window.innerWidth < 640 ? 10 : 12}
                    transform="rotate(-25)"
                  >
                    {formatPeriodLabel(payload.value)}
                  </text>
                </g>
              );
            }}
          />
          <YAxis domain={[0, maxValue + 2]} />
          <Tooltip
            formatter={(value, name) => [value, "Tehingute arv"]}
            labelFormatter={formatPeriodLabel}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: window.innerWidth < 640 ? 12 : 14 }} />
          <Bar dataKey="transaction_count" name="Tehingute arv" fill="#f97316" barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionChart;
