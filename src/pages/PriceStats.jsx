import { useEffect, useState } from "react";

function PriceStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/price-stats")
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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mediaanhinnad piirkonniti</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Piirkond</th>
            <th className="border px-2 py-1 text-left">Periood</th>
            <th className="border px-2 py-1 text-right">€/m²</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{row.region}</td>
              <td className="border px-2 py-1">{row.period}</td>
              <td className="border px-2 py-1 text-right">{row.median_price_per_m2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PriceStats;
