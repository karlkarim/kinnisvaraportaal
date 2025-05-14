import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const keyMap = {
  median_price_per_m2: "Mediaanhind €/m²",
  avg_price_per_m2: "Keskmine hind €/m²"
};

function PriceChart({ selectedRegion, year, months }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedRegion) return;
    const params = new URLSearchParams();
    if (year) params.set("aasta", year);
    if (months && months.length) params.set("kuud", months.join(","));
    fetch(`/api/price-stats-chart?region=${encodeURIComponent(selectedRegion)}&${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server vastas veaga");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Vigane vastuse formaat");
        }
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Graafiku laadimine ebaõnnestus:", err);
        setStats([]);
        setLoading(false);
      });
  }, [selectedRegion, year, months]);

  if (loading) return <p>Laadin graafikut...</p>;
  if (!stats.length) return <p>Andmeid ei leitud.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Hinnagraafik – {selectedRegion}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, keyMap[name] || name]}
            labelFormatter={label => label.replace("-", ".")}
          />
          <Line type="monotone" dataKey="median_price_per_m2" stroke="#8884d8" dot />
          <Line type="monotone" dataKey="avg_price_per_m2" stroke="#82ca9d" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;
