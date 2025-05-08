// src/pages/RegionSelect.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RegionSelect() {
  const [regions, setRegions] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) =>
        console.error("Piirkondade laadimine ebaõnnestus:", err)
      );
  }, []);

  useEffect(() => {
    if (query.length >= 3) {
      const q = query.toLowerCase();
      const matches = regions.filter((region) =>
        region.name.toLowerCase().includes(q)
      );
      setFiltered(matches);
    } else {
      setFiltered([]);
    }
  }, [query, regions]);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">Otsi piirkonda</h1>
      <input
        type="text"
        placeholder="Sisesta piirkonna nimi…"
        className="w-full p-2 border rounded mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {filtered.map((region) => (
          <div
            key={region.name}
            onClick={() =>
              navigate(`/piirkond/${encodeURIComponent(region.name)}`)
            }
            className="p-2 cursor-pointer hover:bg-blue-100 rounded"
          >
            {region.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RegionSelect;
