import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthToQuarter = (month) => {
  if (["01", "02", "03"].includes(month)) return "I";
  if (["04", "05", "06"].includes(month)) return "II";
  if (["07", "08", "09"].includes(month)) return "III";
  if (["10", "11", "12"].includes(month)) return "IV";
  return "";
};

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

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3 className="text-xl font-bold mb-2">{region} mediaanhind vs HPI</h3>
      <ResponsiveContainer>
        <LineChart data={regionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="regionPrice" name={`${region} mediaanhind €/m²`} stroke="#8884d8" />
          <Line type="monotone" dataKey="hpi" name="Eesti HPI" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionPriceVsHPIChart; 