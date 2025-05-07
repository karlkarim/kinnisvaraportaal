import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PriceChart() {
  const [allStats, setAllStats] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/api/price-stats")
      .then((res) => res.json())
      .then((data) => {
        setAllStats(data);
        const uniqueRegions = [...new Set(data.map((item) => item.region))];
        setSelectedRegion(uniqueRegions[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;

    const filtered = allStats
      .filter((item) => item.region === selectedRegion)
      .map((item) => ({
        period: item.period,
        median: item.median_price_per_m2,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    setChartData(filtered);
  }, [selectedRegion, allStats]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="region" className="mr-2 font-semibold">
          Vali piirkond:
        </label>
        <select
          id="region"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {[...new Set(allStats.map((item) => item.region))].map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Mediaanhinna muutus: {selectedRegion}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="period" />
              <YAxis unit=" €" />
              <Tooltip />
              <Line type="monotone" dataKey="median" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>Andmeid ei leitud valitud piirkonna kohta.</p>
      )}
    </div>
  );
}

export default PriceChart;
