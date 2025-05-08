import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapView from "../components/MapView";
import PriceChart from "../components/PriceChart";

function RegionOverview() {
  const { name } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartStats, setChartStats] = useState([]);

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

  if (loading) return <p>Laadin...</p>;
  if (!details) return <p>Andmeid ei leitud.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{details.region}</h1>
      <p className="mb-1">
        <strong>Mediaanhind:</strong> {details.median_price_per_m2} €/m²
      </p>
      <p className="mb-1">
        <strong>Keskmine pindala:</strong> {details.avg_area_m2} m²
      </p>
      <p className="mb-1">
        <strong>Tehinguid:</strong> {details.transaction_count}
      </p>
      <p className="mb-4">
        <strong>Kokku summa:</strong> {details.total_sum_eur} €
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Asukoht kaardil</h2>
      <MapView regionName={details.region} />
      

     
      <PriceChart data={chartStats} selectedRegion={details.region} />

      {/* 
        // Kui hiljem soovid lisada ka tehingute graafikut:
        // <TransactionChart data={transactionStats} />
      */}
    </div>
  );
}

export default RegionOverview;
