import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaChartLine, FaMapMarkerAlt, FaBuilding, FaEuroSign, FaHome, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import MapView from "../components/MapView";
import PriceChart from "../components/PriceChart";
import TransactionChart from "../components/TransactionChart";

function RegionOverview() {
  const { name } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartStats, setChartStats] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);

  useEffect(() => {
    fetch(`/api/region-details?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Piirkonna andmete laadimine ebaõnnestus:", err);
        setLoading(false);
      });
  }, [name]);

  useEffect(() => {
    fetch(`/api/price-stats-chart?region=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setChartStats(data);
      })
      .catch((err) => {
        console.error("Hinnastatistika laadimine ebaõnnestus:", err);
      });
  }, [name]);

  useEffect(() => {
    fetch(`/api/transaction-stats?region=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactionStats(data);
      })
      .catch((err) => {
        console.error("Tehingute statistika laadimine ebaõnnestus:", err);
      });
  }, [name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Andmeid ei leitud</h2>
        <Link to="/piirkond" className="text-teal-600 hover:text-teal-700">
          Tagasi piirkondade nimekirja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/piirkond"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              <span>Tagasi</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">{details.region}</h1>
          <p className="text-white/90">Detailne ülevaade piirkonna kinnisvaraturust</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-3 rounded-lg">
                <FaEuroSign className="text-teal-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Mediaanhind</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{details.median_price_per_m2} €/m²</p>
            <p className="text-sm text-neutral-500 mt-1">Keskmine ruutmeetri hind</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-3 rounded-lg">
                <FaBuilding className="text-teal-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Keskmine pindala</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{details.avg_area_m2} m²</p>
            <p className="text-sm text-neutral-500 mt-1">Keskmine kinnistu suurus</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-3 rounded-lg">
                <FaChartLine className="text-teal-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Tehinguid</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{details.transaction_count}</p>
            <p className="text-sm text-neutral-500 mt-1">Tehtud tehingud</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-3 rounded-lg">
                <FaEuroSign className="text-teal-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Kokku summa</h3>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{details.total_sum_eur.toLocaleString()} €</p>
            <p className="text-sm text-neutral-500 mt-1">Kogu tehingute summa</p>
          </motion.div>
        </div>

        {/* Map and Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="bg-teal-100 p-2 rounded-lg">
                <FaMapMarkerAlt className="text-teal-600" />
              </div>
              Asukoht kaardil
            </h2>
            <MapView regionName={details.region} />
          </motion.div>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="bg-teal-100 p-2 rounded-lg">
                <FaChartBar className="text-teal-600" />
              </div>
              Hinnadünaamika
            </h2>
            <PriceChart data={chartStats} selectedRegion={details.region} />
          </motion.div>
        </div>

        {/* Transaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaCalendarAlt className="text-teal-600" />
            </div>
            Tehingute statistika
          </h2>
          <TransactionChart data={transactionStats} region={details.region} />
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaHome className="text-teal-600" />
            </div>
            Piirkonna info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Asukoht</h3>
              <p className="text-neutral-600">{details.region}</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">Hoonestus</h3>
              <p className="text-neutral-600">Keskmine hoonestustihedus: {details.avg_area_m2} m²</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegionOverview;
