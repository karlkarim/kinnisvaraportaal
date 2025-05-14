// src/pages/RegionSelect.jsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const months = [
  "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
  "Juuli", "August", "September", "Oktoober", "November", "Detsember"
];

// Piirkondade nimekiri (võib asendada API päringuga)
import regionList from "../../regionList.json";

function RegionSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Algväärtused URL-ist
  const urlRegion = decodeURIComponent(params.name || "");
  const searchParams = new URLSearchParams(location.search);
  const urlYear = searchParams.get("aasta") || "2024";
  const urlKuud = searchParams.get("kuud") ? searchParams.get("kuud").split(",") : months;

  // State'id, mis lähtestuvad URL muutumisel
  const [year, setYear] = useState(urlYear);
  const [selectedMonths, setSelectedMonths] = useState(urlKuud);
  const [selectedRegion, setSelectedRegion] = useState(urlRegion);

  // Otsingulahtri state (query) on ainult kasutaja sisestuseks
  const [query, setQuery] = useState("");
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const regionInputRef = useRef(null);

  // Kui URL muutub (nt navigeerimisel), uuenda state'id ainult kui väärtus päriselt muutub
  useEffect(() => {
    if (selectedRegion !== urlRegion) setSelectedRegion(urlRegion);
    if (year !== urlYear) setYear(urlYear);
    if (selectedMonths.join() !== urlKuud.join()) setSelectedMonths(urlKuud);
    // eslint-disable-next-line
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (query.length >= 2) {
      const q = query.toLowerCase();
      setFilteredRegions(regionList.filter(r => r.toLowerCase().includes(q)));
    } else {
      setFilteredRegions([]);
    }
  }, [query]);

  // Dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (regionInputRef.current && !regionInputRef.current.contains(event.target)) {
        setRegionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthChange = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const allSelected = selectedMonths.length === months.length;
  const toggleAll = () => {
    if (allSelected) setSelectedMonths([]);
    else setSelectedMonths(months);
  };

  // Kuude kokkuvõte tekst
  const monthsSummary = allSelected
    ? "Kõik kuud"
    : selectedMonths.length === 0
    ? "Vali kuud"
    : selectedMonths.length === 1
    ? selectedMonths[0]
    : `${selectedMonths[0]} +${selectedMonths.length - 1}`;

  // Näita andmeid nupu handler: navigeeri detailvaatesse koos query stringiga
  const handleShowData = (e) => {
    e.preventDefault();
    if (selectedRegion) {
      const params = new URLSearchParams();
      params.set("aasta", year);
      params.set("kuud", selectedMonths.join(","));
      navigate(`/piirkond/${encodeURIComponent(selectedRegion)}?${params.toString()}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900">Piirkondade ülevaade</h1>
          <p className="text-neutral-600 text-lg">
            Vali piirkond, aasta ja kuud, mille kohta soovid näha detailset statistikat
          </p>
        </div>

        <form className="flex flex-col gap-6 items-center justify-center mt-8 w-full" onSubmit={handleShowData}>
          {/* Piirkonna otsing ja valik */}
          <div className="w-full max-w-md relative" ref={regionInputRef}>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-2xl shadow focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-xl py-5 pl-12 pr-4 font-semibold bg-white placeholder-gray-400"
                placeholder="Sisesta piirkonna nimi..."
                value={selectedRegion || query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedRegion("");
                  setRegionDropdownOpen(true);
                }}
                onFocus={() => setRegionDropdownOpen(true)}
                autoComplete="off"
              />
            </div>
            {regionDropdownOpen && filteredRegions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border rounded-xl shadow-xl mt-2 max-h-60 overflow-y-auto">
                {filteredRegions.map(region => (
                  <div
                    key={region}
                    className="p-3 hover:bg-gray-50 cursor-pointer text-lg"
                    onClick={() => {
                      setSelectedRegion(region);
                      setQuery("");
                      setRegionDropdownOpen(false);
                    }}
                  >
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aasta ja kuude valik samal real */}
          <div className="flex flex-row gap-4 w-full max-w-md items-center">
            {/* Aasta valik (ainult 2024) */}
            <div className="flex items-center gap-2">
              <label className="font-semibold text-lg">Aasta:</label>
              <select className="border rounded px-4 py-2 text-lg" value={year} disabled>
                <option value="2024">2024</option>
              </select>
            </div>
            {/* Kuude dropdown-checkboxid */}
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                type="button"
                className="w-full border rounded px-4 py-2 text-lg flex justify-between items-center bg-white shadow-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <span>{monthsSummary}</span>
                <svg className={`ml-2 w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-xl p-4 animate-fade-in">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="all-months"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="mr-2"
                    />
                    <label htmlFor="all-months" className="font-medium cursor-pointer">
                      Vali kõik kuud
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {months.map((month) => (
                      <label key={month} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(month)}
                          onChange={() => handleMonthChange(month)}
                        />
                        {month}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Näita andmeid nupp */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow transition-all duration-200 disabled:opacity-50"
            disabled={!selectedRegion}
          >
            Näita andmeid
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default RegionSelect;
