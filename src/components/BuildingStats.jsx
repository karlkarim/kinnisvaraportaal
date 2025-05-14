import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaHome, FaWarehouse, FaLeaf } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function BuildingStats({ region }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/building-stats?region=${encodeURIComponent(region)}`);
        if (!response.ok) throw new Error('Andmete laadimine ebaõnnestus');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Viga hoonestuse statistika laadimisel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [region]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Hoonestuse statistika pole saadaval</p>
      </div>
    );
  }

  // Valmistame andmed graafiku jaoks
  const materialData = [
    { name: 'Paneel', value: stats.materials.panel },
    { name: 'Telliskivi', value: stats.materials.brick },
    { name: 'Puit', value: stats.materials.wood },
    { name: 'Monoliit', value: stats.materials.monolithic }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Hoonestuse ülevaade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaBuilding className="text-teal-600" />
            </div>
            <h3 className="font-semibold text-neutral-800">Keskmine ehitusaasta</h3>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.avg_construction_year}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaLeaf className="text-teal-600" />
            </div>
            <h3 className="font-semibold text-neutral-800">Energiamärgis</h3>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.energy_rating}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaHome className="text-teal-600" />
            </div>
            <h3 className="font-semibold text-neutral-800">Korterelamud</h3>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.building_types.apartments}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaWarehouse className="text-teal-600" />
            </div>
            <h3 className="font-semibold text-neutral-800">Eramajad</h3>
          </div>
          <p className="text-xl font-bold text-neutral-900">{stats.building_types.houses}</p>
        </motion.div>
      </div>

      {/* Materjalide jaotus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold mb-4">Hoonete materjalide jaotus</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={materialData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {materialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

export default BuildingStats; 