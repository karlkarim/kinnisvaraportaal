import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white text-[17px] md:text-[18px] font-sans">
      {/* Hero Section */}
      <section className="px-6 py-28 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-left">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-neutral-900">Kinnisvaraportaal</h1>
          <p className="text-neutral-700 text-lg max-w-xl">
            Kasuta andmeid, mitte oletusi. Saa ülevaade kinnisvarahindade dünaamikast piirkondade lõikes ning tee teadlikke otsuseid.
          </p>
          <Link
            to="/piirkond"
            className="inline-block bg-teal-600 text-white py-3 px-7 rounded-2xl text-lg font-semibold hover:bg-teal-700 transition"
          >
            Alusta piirkonna vaatamist
          </Link>
        </div>
        <div className="lg:col-span-6">
          <img
            src="/illustratsioonid/piirkondade-vordlus.png"
            alt="Statistika visualiseerimine"
            className="w-full max-w-md mx-auto rounded-2xl"
          />
        </div>
      </section>

      {/* Info blocks */}
      <section className="bg-[#eef2f6] px-6 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">Miks see on kasulik?</h2>
            <p className="text-neutral-700 text-lg">
              Portaal aitab mõista kinnisvara hinnadünaamikat ja trende Eesti piirkondades: koduotsijatele, investoritele ja arendajatele.
            </p>
            <img
              src="/illustratsioonid/kaart-analuus.png"
              alt="Graafik kaardil"
              className="w-full max-w-sm rounded-2xl"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900">Kuidas see toimib?</h2>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700 text-lg">
              <li>Otsi piirkonda nime järgi</li>
              <li>Vaata mediaanhindu ja tehinguarvu</li>
              <li>Analüüsi graafikuid ja trende</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Kuidas see portaal aitab erinevaid kasutajaid */}
      <section className="px-6 py-24 max-w-6xl mx-auto bg-white">
        <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Kuidas see portaal aitab?</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-[#f1f5f9] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Koduostja</h3>
            <p className="text-neutral-700 text-sm">
              Võrdle piirkondade hinnataset ja vali sobiv kodu hinna ja kvaliteedi suhte järgi.
            </p>
          </div>
          <div className="bg-[#f1f5f9] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Investor</h3>
            <p className="text-neutral-700 text-sm">
              Tuvasta piirkonnad, kus on kiire hinnakasv või stabiilne tootluspotentsiaal.
            </p>
          </div>
          <div className="bg-[#f1f5f9] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-neutral-800">Arendaja</h3>
            <p className="text-neutral-700 text-sm">
              Saa ülevaade piirkondade hoonestusest, ehitusaastatest ja kinnisvaratüüpide osakaalust.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-neutral-900">Unikaalne tööriist</h2>
        <p className="text-neutral-700 text-lg">
          Meie portaal ei kuva kuulutusi – ainult usaldusväärset statistikat. Ülevaade viimaste kvartalite hindadest, piirkondade võrdlus ja hoonestusprofiilid.
        </p>
        <Link
          to="/piirkond"
          className="inline-block bg-teal-600 text-white py-3 px-7 rounded-2xl text-lg font-semibold hover:bg-teal-700 transition"
        >
          Vaata piirkondi
        </Link>
      </section>

      <section className="bg-[#eef2f6] px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Kellele see portaal on mõeldud?</h2>
          <ul className="list-disc pl-6 space-y-4 text-neutral-700 text-lg">
            <li><strong>Koduostjale:</strong> saad teada, milline piirkond on hinnalt ja kvaliteedilt sobivaim.</li>
            <li><strong>Investorile:</strong> hindade kasv, aktiivsus ja trendid aitavad teha kasumlikke otsuseid.</li>
            <li><strong>Arendajale:</strong> näed piirkonna hoonestusprofiili, ehitusaastaid ja turuaktiivsust.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
