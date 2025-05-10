// src/pages/RegionSelect.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

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
    if (query.length >= 2) {
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900">Piirkondade ülevaade</h1>
          <p className="text-neutral-600 text-lg">
            Vali piirkond, mille kohta soovid näha detailset statistikat
          </p>
        </div>

        <div className="relative">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sisesta piirkonna nimi..."
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100"
            >
              {filtered.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/piirkond/${encodeURIComponent(region.name)}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors duration-200"
                >
                  <FaMapMarkerAlt className="text-teal-500" />
                  <span className="text-lg">{region.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {query.length >= 2 && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-gray-500"
            >
              Piirkonda ei leitud
            </motion.div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.slice(0, 6).map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/piirkond/${encodeURIComponent(region.name)}`)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-teal-500 text-xl" />
                <h3 className="text-lg font-semibold text-neutral-800">{region.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default RegionSelect;
