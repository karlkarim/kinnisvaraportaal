import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import formatEur from "../utils/formatEur";

const keyMap = {
  median_price_per_m2: "Mediaanhind €/m²",
  avg_price_per_m2: "Keskmine hind €/m²"
};

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

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

  // X-telje kuupäevad kujule "01/24"
  const formatXAxis = (period) => {
    const [year, month] = period.split("-");
    return `${month}/${year.slice(-2)}`;
  };

  // Tooltipi label "Jan 24"
  const formatTooltipLabel = (period) => {
    const [year, month] = period.split("-");
    return `${monthNamesShort[parseInt(month, 10) - 1]} ${year.slice(-2)}`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Hinnagraafik – {selectedRegion}</h2>
      <p className="text-sm text-neutral-600 mb-2">Näitab valitud piirkonna mediaan- ja keskmise hinna muutust ajas.</p>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                    {formatXAxis(payload.value)}
                  </text>
                </g>
              );
            }}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [formatEur(value, name.includes("m²")), keyMap[name] || name]}
            labelFormatter={formatTooltipLabel}
          />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: window.innerWidth < 640 ? 12 : 14 }} />
          <Line type="monotone" dataKey="median_price_per_m2" name="Mediaanhind €/m²" stroke="#1e3a8a" dot />
          <Line type="monotone" dataKey="avg_price_per_m2" name="Keskmine hind €/m²" stroke="#16a34a" dot />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-neutral-500">
        <b>Mediaanhind</b> – väärtus, millest pooled tehingud on odavamad ja pooled kallimad.<br />
        <b>Keskmine hind</b> – kõigi tehingute aritmeetiline keskmine hind.
      </div>
    </div>
  );
}

export default PriceChart;
