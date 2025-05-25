import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaTools } from "react-icons/fa";

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatXAxis = (period) => {
  if (!period) return "";
  const [year, quarter] = period.split("-");
  // Kui kvartal on number, teisenda rooma numbriks
  const quarterMap = { "I": "01", "II": "04", "III": "07", "IV": "10", "1": "01", "2": "04", "3": "07", "4": "10" };
  const month = quarterMap[quarter] || quarter;
  return `${month}/${year.slice(-2)}`;
};

const formatTooltipLabel = (period) => {
  if (!period) return "";
  const [year, quarter] = period.split("-");
  // Näita "Q1 24" vms
  return `Q${quarter.replace(/[^0-9]/g, "") || quarter} ${year.slice(-2)}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow border border-gray-200">
        <div className="font-semibold mb-1">{formatTooltipLabel(d.period)}</div>
        <div>Indeks: <span className="font-bold">{d.index_value}</span></div>
      </div>
    );
  }
  return null;
};

const ConstructionIndexChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/fetchConstructionIndex")
      .then((res) => {
        if (!res.ok) throw new Error("API viga");
        return res.json();
      })
      .then((rows) => {
        setData(
          rows.map((row) => ({
            year: row.year,
            quarter: row.quarter,
            index_value: Number(row.index_value),
            period: `${row.year}-${row.quarter}`,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Laen ehitushinnaandmeid...</div>;
  if (error) return <div className="text-red-600">Andmete laadimine ebaõnnestus. Proovi hiljem uuesti.</div>;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-yellow-100 p-2 rounded-lg"><FaTools className="text-yellow-600 text-lg" /></span>
        <h2 className="text-lg sm:text-xl font-semibold">Ehitushinnaindeksi trend</h2>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="period"
            interval={window.innerWidth < 640 ? 2 : 0}
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y + 10})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor="end"
                  fontSize={window.innerWidth < 640 ? 10 : 12}
                  transform="rotate(-25)"
                >
                  {formatXAxis(payload.value)}
                </text>
              </g>
            )}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: window.innerWidth < 640 ? 12 : 14 }} />
          <Line type="monotone" dataKey="index_value" name="Ehitushinnaindeks" stroke="#f59e42" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConstructionIndexChart; 