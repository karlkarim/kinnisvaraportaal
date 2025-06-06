import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaChartLine, FaMapMarkerAlt, FaBuilding, FaEuroSign, FaHome, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import MapView from "../components/MapView";
import PriceChart from "../components/PriceChart";
import TransactionChart from "../components/TransactionChart";
import BuildingStats from "../components/BuildingStats";
import RegionSelect from "./RegionSelect";
import RegionPriceVsHPIChart from "../components/RegionPriceVsHPIChart";
import ConstructionIndexChart from "../components/ConstructionIndexChart";
import formatEur from "../utils/formatEur";
import ChartModalWrapper from "../components/ChartModalWrapper";

const allMonths = [
  "Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni",
  "Juuli", "August", "September", "Oktoober", "November", "Detsember"
];

function RegionOverview() {
  const { name } = useParams();
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartStats, setChartStats] = useState([]);
  const [transactionStats, setTransactionStats] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Loen query parameetrid
  const params = new URLSearchParams(location.search);
  const year = params.get("aasta") || "2024";
  const kuudParam = params.get("kuud");
  const months = kuudParam ? kuudParam.split(",") : allMonths;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/region-details?name=${encodeURIComponent(name)}&aasta=${encodeURIComponent(year)}&kuud=${encodeURIComponent(months.join(","))}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Piirkonna andmete laadimine ebaõnnestus:", err);
        setLoading(false);
      });
  }, [name, year, kuudParam]);

  useEffect(() => {
    fetch(`/api/price-stats-chart?region=${encodeURIComponent(name)}&aasta=${encodeURIComponent(year)}&kuud=${encodeURIComponent(months.join(","))}`)
      .then((res) => res.json())
      .then((data) => {
        setChartStats(data);
      })
      .catch((err) => {
        console.error("Hinnastatistika laadimine ebaõnnestus:", err);
      });
  }, [name, year, kuudParam]);

  useEffect(() => {
    fetch(`/api/transaction-stats?region=${encodeURIComponent(name)}&aasta=${encodeURIComponent(year)}&kuud=${encodeURIComponent(months.join(","))}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactionStats(data);
      })
      .catch((err) => {
        console.error("Tehingute statistika laadimine ebaõnnestus:", err);
      });
  }, [name, year, kuudParam]);

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
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      {/* Filter ja otsing alati nähtav */}
      <RegionSelect />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/piirkond"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              <span>Tagasi</span>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{details.region}</h1>
          <p className="text-white/90">Detailne ülevaade piirkonna kinnisvaraturust</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 sm:p-3 rounded-lg">
                <FaEuroSign className="text-teal-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-800">Mediaanhind</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">{details.median_price_per_m2} €/m²</p>
            <p className="text-sm text-neutral-500 mt-1">Keskmine ruutmeetri hind</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 sm:p-3 rounded-lg">
                <FaBuilding className="text-teal-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-800">Keskmine pindala</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">{details.avg_area_m2} m²</p>
            <p className="text-sm text-neutral-500 mt-1">Keskmine kinnistu suurus</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 sm:p-3 rounded-lg">
                <FaChartLine className="text-teal-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-800">Tehinguid</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">{details.transaction_count}</p>
            <p className="text-sm text-neutral-500 mt-1">Tehtud tehingud</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 p-2 sm:p-3 rounded-lg">
                <FaEuroSign className="text-teal-600 text-lg sm:text-xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-800">Kokku summa</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900">{formatEur(details.total_sum_eur)}</p>
            <p className="text-sm text-neutral-500 mt-1">Kogu tehingute summa</p>
          </motion.div>
        </div>

        {/* Map and Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Asukoht kaardil - täislaiuses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 col-span-1 sm:col-span-2 w-full"
          >
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="bg-teal-100 p-2 rounded-lg">
                <FaMapMarkerAlt className="text-teal-600" />
              </div>
              Asukoht kaardil
            </h2>
            <div className="h-[220px] xs:h-[320px] sm:h-[400px] w-full">
              <MapView regionName={details.region} heightClass="h-56" />
            </div>
          </motion.div>

          {/* spacing ainult mobiilis */}
          <div className="sm:hidden h-6"></div>

          {/* Hinnadünaamika */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <div className="w-screen -mx-4 sm:hidden mb-6">
              <PriceChart selectedRegion={details.region} year={year} months={months} />
            </div>
            <div className="hidden sm:block sm:bg-white sm:p-6 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl sm:transition-all sm:duration-300 sm:border sm:border-gray-100">
              <ChartModalWrapper title={`Hinnagraafik – ${details.region}`}>
                <PriceChart selectedRegion={details.region} year={year} months={months} />
              </ChartModalWrapper>
            </div>
          </motion.div>

          {/* Mediaanhind vs HPI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full"
          >
            <div className="w-screen -mx-4 sm:hidden mb-6">
              <RegionPriceVsHPIChart region={details.region} />
            </div>
            <div className="hidden sm:block sm:bg-white sm:p-6 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl sm:transition-all sm:duration-300 sm:border sm:border-gray-100">
              <ChartModalWrapper title={`${details.region} mediaanhind vs HPI`}>
                <RegionPriceVsHPIChart region={details.region} />
              </ChartModalWrapper>
            </div>
          </motion.div>
        </div>

        {/* Transaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full"
        >
          <div className="w-screen -mx-4 sm:hidden mb-6">
            <TransactionChart data={transactionStats} region={details.region} />
          </div>
          <div className="hidden sm:block sm:bg-white sm:p-6 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl sm:transition-all sm:duration-300 sm:border sm:border-gray-100">
            <ChartModalWrapper title="Tehingute statistika">
              <TransactionChart data={transactionStats} region={details.region} />
            </ChartModalWrapper>
          </div>
        </motion.div>

        {/* Ehitushinnaindeksi trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full"
        >
          <div className="w-screen -mx-4 sm:hidden mb-6">
            <ConstructionIndexChart />
          </div>
          <div className="hidden sm:block sm:bg-white sm:p-6 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl sm:transition-all sm:duration-300 sm:border sm:border-gray-100">
            <ChartModalWrapper title="Ehitushinnaindeksi trend">
              <ConstructionIndexChart />
            </ChartModalWrapper>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaHome className="text-teal-600" />
            </div>
            Piirkonna info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

        {/* Building Stats Section */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaBuilding className="text-teal-600" />
            </div>
            Hoonestuse statistika
          </h2>
          <BuildingStats region={details.region} />
        </motion.div>
        */}
      </motion.div>
    </div>
  );
}

export default RegionOverview;
