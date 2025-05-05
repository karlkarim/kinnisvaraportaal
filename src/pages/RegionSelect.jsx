import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import regionList from "../data/regionList";

function RegionSelect() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [regionList, setRegionList] = useState([]);

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegionList(data))
      .catch((err) => console.error("Laadimine ebaõnnestus", err));
  }, []);
  

  const filtered = regionList.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (name) => {
    navigate(`/piirkond/${name}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">Otsi piirkonda</h1>

      <input
        type="text"
        placeholder="Sisesta piirkonna nimi..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <li key={r.name}>
              <button
                onClick={() => handleSelect(r.name)}
                className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded"
              >
                {r.name}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Tulemusi ei leitud</li>
        )}
      </ul>
    </div>
  );
}

export default RegionSelect;
