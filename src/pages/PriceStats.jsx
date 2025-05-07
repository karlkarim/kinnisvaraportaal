import { useEffect, useState } from "react";
import PriceChart from "../components/PriceChart"; // vajadusel kohanda teed

function PriceStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/price-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Andmete laadimine ebaõnnestus:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Laadin andmeid...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 overflow-x-auto">
      <PriceChart />
      <h1 className="text-2xl font-bold mb-4">Hinnastatistika 2023 (Tallinn)</h1>
      <table className="min-w-full text-sm border border-collapse bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Periood</th>
            <th className="border px-2 py-1">Piirkond</th>
            <th className="border px-2 py-1">Suurusgrupp</th>
            <th className="border px-2 py-1 text-right">Tehinguid</th>
            <th className="border px-2 py-1 text-right">Keskmine m²</th>
            <th className="border px-2 py-1 text-right">Mediaan €/m²</th>
            <th className="border px-2 py-1 text-right">Keskmine €/m²</th>
            <th className="border px-2 py-1 text-right">Kokku €</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{row.period}</td>
              <td className="border px-2 py-1">{row.region}</td>
              <td className="border px-2 py-1">{row.size_group}</td>
              <td className="border px-2 py-1 text-right">{row.transaction_count}</td>
              <td className="border px-2 py-1 text-right">{row.avg_area_m2}</td>
              <td className="border px-2 py-1 text-right">{row.median_price_per_m2}</td>
              <td className="border px-2 py-1 text-right">{row.avg_price_per_m2}</td>
              <td className="border px-2 py-1 text-right">{row.total_sum_eur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PriceStats;
