import { useEffect, useState } from 'react';
import HPIStats from '../components/HPIStats';

const HPIPage = () => {
  const [hpiData, setHpiData] = useState([]);
  useEffect(() => {
    fetch('/api/hpi')
      .then(res => res.json())
      .then(setHpiData);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Harjumaa hinnaindeksi trend</h1>
      <HPIStats />
    </div>
  );
};

export default HPIPage; 