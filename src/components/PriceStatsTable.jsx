import { useEffect, useState } from "react";

export default function PriceStatsTable() {
  const [data, setData] = useState([]);
  const [laen, setLaen] = useState(true);

  useEffect(() => {
    fetch("/api/price-stats")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLaen(false);
      })
      .catch((err) => {
        console.error("❌ Andmete laadimine ebaõnnestus:", err);
        setLaen(false);
      });
  }, []);

  if (laen) return <p>Laen andmeid...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Kinnisvara hinnastatistika</h2>
      <table className="min-w-full border text-sm bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border">Periood</th>
            <th className="px-2 py-1 border">Piirkond</th>
            <th className="px-2 py-1 border">Suurusgrupp</th>
            <th className="px-2 py-1 border">Tehinguid</th>
            <th className="px-2 py-1 border">Keskmine m²</th>
            <th className="px-2 py-1 border">Mediaan €/m²</th>
            <th className="px-2 py-1 border">Keskmine €/m²</th>
            <th className="px-2 py-1 border">Kokku €</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-2 py-1 border">{row.period}</td>
              <td className="px-2 py-1 border">{row.region}</td>
              <td className="px-2 py-1 border">{row.size_group}</td>
              <td className="px-2 py-1 border text-right">{row.transaction_count}</td>
              <td className="px-2 py-1 border text-right">{row.avg_area_m2}</td>
              <td className="px-2 py-1 border text-right">{row.median_price_per_m2}</td>
              <td className="px-2 py-1 border text-right">{row.avg_price_per_m2}</td>
              <td className="px-2 py-1 border text-right">{row.total_sum_eur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
