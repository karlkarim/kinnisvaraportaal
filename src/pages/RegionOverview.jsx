import { useParams } from "react-router-dom";
import regionList from "../data/regionList";
import PriceChart from "../components/PriceChart";
import TransactionChart from "../components/TransactionChart";
import BuildingTypePie from "../components/BuildingTypePie";
import MapView from "../components/MapView";

function RegionOverview() {
  const { name } = useParams();
  const selectedRegion = regionList.find(r => r.name.toLowerCase() === name?.toLowerCase());

  if (!selectedRegion) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Piirkonda "{name}" ei leitud.
      </div>
    );
  }

  const latestPrice =
    selectedRegion.priceHistory?.[selectedRegion.priceHistory.length - 1]?.pricePerM2 ?? "–";

  return (
    <div className="space-y-10">
      <section className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{selectedRegion.name}</h1>
        <p className="text-gray-600 mb-4">
          Keskmine hind 2024 Q1:{" "}
          <span className="font-semibold text-gray-800">{latestPrice} €/m²</span>
        </p>
        <ul className="text-gray-700 list-disc list-inside space-y-1">
          <li><span className="font-semibold">Ehitiste arv:</span> {selectedRegion.buildings.totalBuildings}</li>
          <li><span className="font-semibold">Keskmine ehitusaasta:</span> {selectedRegion.buildings.averageYear}</li>
          <li><span className="font-semibold">Peamine tüüp:</span> {selectedRegion.buildings.dominantType}</li>
          <li><span className="font-semibold">Keskmine energiamärgis:</span> {selectedRegion.buildings.energyClass}</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Asukoht kaardil</h2>
        <div className="h-[400px] overflow-hidden rounded">
          <MapView center={selectedRegion.center} />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hinnatrend</h2>
        <PriceChart data={selectedRegion.priceHistory} />
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tehingute arv</h2>
        <TransactionChart data={selectedRegion.transactionCount} />
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Elamutüüpide jaotus</h2>
        <BuildingTypePie data={selectedRegion.buildingTypes} />
      </section>
    </div>
  );
}

export default RegionOverview;
