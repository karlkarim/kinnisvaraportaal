import { useEffect, useState } from 'react';
import pb from '../utils/pocketbase';

function MaakondList() {
  const [maakonnad, setMaakonnad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('maakond')
      .getList(1, 50)
      .then(res => {
        setMaakonnad(res.items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Maakondade laadimine ebaõnnestus:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Laen maakonna andmeid...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Maakonnad</h1>
      <ul className="list-disc pl-6 space-y-1">
        {maakonnad.map(m => (
          <li key={m.id}>{m.nimi || m.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MaakondList;
