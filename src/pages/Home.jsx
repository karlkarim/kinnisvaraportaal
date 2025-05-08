import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.section
        className="grid md:grid-cols-2 items-center gap-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Kinnisvaraportaal</h1>
          <p className="text-gray-700 text-lg mb-6">
            Kinnisvaraportaal pakub võimaluse kiiresti ja mugavalt süvendada arusaama kinnisvara hindade trendidest erinevates piirkondades.
          </p>
          <Link
            to="/piirkond"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-700 transition animate-pulse"
          >
            Alusta piirkonna vaatamist
          </Link>
        </div>
        <div>
          <img
            src="/illustratsioonid/piirkondade-vordlus.png"
            alt="Statistika visualiseerimine"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </motion.section>

      {/* Info blocks */}
      <motion.section
        className="grid md:grid-cols-2 gap-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-xl font-semibold mb-2">Miks see on kasulik?</h2>
          <p className="text-gray-700 mb-4">
            Kinnisvaraportaal võimaldab lihtsalt mõista kinnisvara hinnadünaamikat ja trende Eesti piirkondades.
          </p>
          <img src="/illustratsioonid/kaart-analuus.png" alt="Graafik kaardil" className="w-full max-w-sm mx-auto" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Kuidas see toimib?</h2>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            <li>Sisesta piirkonna nimi</li>
            <li>Leia tehingute ajalugu ja hinnastatistika</li>
            <li>Vaata graafikuid ja võrdlusi</li>
          </ul>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2">Unikaalne tööriist</h2>
        <p className="text-gray-700 mb-4">
          Meie portaaliga saad ülilihtsalt ja kiirelt ülevaate hindade dünaamikast Eestis. Suunatud koduostjale, turu jälgijale ja investorile, andes kasulikke teadmisi hetkega.
        </p>
        <Link
          to="/piirkond"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-700 transition"
        >
          Vaata piirkondi
        </Link>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2">Kellele see portaal on mõeldud?</h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li><strong>Koduostjale:</strong> saad teada, milline piirkond on hinnalt ja kvaliteedilt sobivaim.</li>
          <li><strong>Investorile:</strong> hindade kasv, aktiivsus ja trendid aitavad teha kasumlikke otsuseid.</li>
          <li><strong>Arendajale:</strong> näed piirkonna hoonestusprofiili, ehitusaastaid ja turuaktiivsust.</li>
        </ul>
      </motion.section>
    </div>
  );
}
