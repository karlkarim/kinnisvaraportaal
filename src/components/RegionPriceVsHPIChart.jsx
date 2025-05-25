import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import formatEur from "../utils/formatEur";

const monthToQuarter = (month) => {
  if (["01", "02", "03"].includes(month)) return "I";
  if (["04", "05", "06"].includes(month)) return "II";
  if (["07", "08", "09"].includes(month)) return "III";
  if (["10", "11", "12"].includes(month)) return "IV";
  return "";
};

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ChartWrapper = ({ children }) => (
  <div className="overflow-x-auto">
    <div className="min-w-[640px]">{children}</div>
  </div>
);

const RegionPriceVsHPIChart = ({ region }) => {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/price-stats?region=${encodeURIComponent(region)}`).then(res => res.json()),
      fetch("/api/hpi").then(res => res.json())
    ]).then(([regionStats, hpiStats]) => {
      // Loome HPI map'i kvartali järgi (nt "2024-I")
      const hpiMap = {};
      hpiStats.forEach(row => {
        hpiMap[`${row.year}-${row.quarter}`] = Number(row.value);
      });

      // Loome graafiku andmed: igale kuule vastava kvartali HPI
      const chartData = regionStats.map(row => {
        // Eeldame, et row.period on kujul "2024-01"
        const [year, month] = row.period.split("-");
        const quarter = monthToQuarter(month);
        const hpiKey = `${year}-${quarter}`;
        return {
          period: row.period,
          regionPrice: Number(row.median_price_per_m2),
          hpi: hpiMap[hpiKey] ?? null
        };
      });

      setRegionData(chartData);
      setLoading(false);
    });
  }, [region]);

  if (loading) return <div>Laen...</div>;

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
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={regionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
          formatter={(value, name) => [formatEur(value, name === "regionPrice"), name === "regionPrice" ? `${region} mediaanhind €/m²` : "Eesti HPI"]}
          labelFormatter={formatTooltipLabel}
        />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: window.innerWidth < 640 ? 12 : 14 }} />
        <Line type="monotone" dataKey="regionPrice" name={`${region} mediaanhind €/m²`} stroke="#1e3a8a" dot />
        <Line type="monotone" dataKey="hpi" name="Eesti HPI" stroke="#16a34a" dot />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RegionPriceVsHPIChart; 