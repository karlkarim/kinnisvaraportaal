import { useEffect, useState } from 'react';

const HPIStats = () => {
  const [hpiData, setHpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/hpi')
      .then((res) => {
        if (!res.ok) throw new Error('API viga');
        return res.json();
      })
      .then((data) => {
        setHpiData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading HPI data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Harjumaa Kinnisvara Hinnaindeks (HPI)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Aasta</th>
              <th className="px-4 py-2 border">Kvartal</th>
              <th className="px-4 py-2 border">HPI Väärtus</th>
            </tr>
          </thead>
          <tbody>
            {hpiData.map((row) => (
              <tr key={`${row.year}-${row.quarter}`}>
                <td className="px-4 py-2 border">{row.year}</td>
                <td className="px-4 py-2 border">{row.quarter}</td>
                <td className="px-4 py-2 border">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HPIStats; 