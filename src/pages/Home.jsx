import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaMapMarkedAlt, FaBuilding, FaSearch, FaChartBar, FaInfoCircle, FaUserFriends, FaLightbulb, FaBalanceScale } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-[16px] md:text-[18px] font-sans">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Eesti kinnisvaraturu andmeportaal
          </h1>
          <p className="text-neutral-700 text-lg sm:text-xl max-w-2xl mx-auto">
            Sõltumatu ja andmepõhine kinnisvaraplatvorm, mis keskendub elukondliku kinnisvara hinnastatistikale Eestis. Võrdle piirkondade hindu, trende ja hoonestusinfot – tee teadlikke otsuseid!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto flex justify-center"
          >
            <Link
              to="/piirkond"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Alusta piirkondade võrdlust
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* For Whom Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center"
        >
          Kellele ja miks?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaUserFriends className="text-teal-600 text-3xl" />, 
              title: "Koduotsijale",
              desc: "Leia parim piirkond oma eelarvele ja elustiilile. Võrdle hindu, elamutüüpe ja trende."
            },
            {
              icon: <FaBalanceScale className="text-teal-600 text-3xl" />, 
              title: "Investorile",
              desc: "Tuvasta investeerimisvõimalused, analüüsi turutrende ja riske."
            },
            {
              icon: <FaLightbulb className="text-teal-600 text-3xl" />, 
              title: "Arendajale ja maaklerile",
              desc: "Saa ülevaade piirkondade hoonestusest, hinnadünaamikast ja konkurentsist."
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-neutral-800">{item.title}</h3>
              <p className="text-neutral-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why is it good? Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center"
        >
          Miks kasutada seda portaali?
        </motion.h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
            {[
              {
                text: "Võrdle piirkondade hindu, trende ja tehingute arvu ajas.",
                icon: <FaChartLine className="text-teal-600 text-xl" />,
                color: "bg-teal-100"
              },
              {
                text: "Vaata mediaanhinda €/m², tehingute arvu ja hoonestusinfot.",
                icon: <FaInfoCircle className="text-blue-500 text-xl" />,
                color: "bg-blue-100"
              },
              {
                text: "Analüüsi korterite ja majade hinnadünaamikat.",
                icon: <FaChartBar className="text-teal-600 text-xl" />,
                color: "bg-teal-100"
              },
              {
                text: "Vaata piirkondade hoonestusprofiile (ehitusaasta, materjal, energiamärgis).",
                icon: <FaBuilding className="text-blue-500 text-xl" />,
                color: "bg-blue-100"
              },
              {
                text: "Võrdle piirkondi omavahel (tulemas).",
                icon: <FaBalanceScale className="text-teal-600 text-xl" />,
                color: "bg-teal-100"
              },
              {
                text: "Kogu info põhineb usaldusväärsetel allikatel: Maa-amet, Ehitisregister, Statistikaamet.",
                icon: <FaInfoCircle className="text-blue-500 text-xl" />,
                color: "bg-blue-100"
              },
              {
                text: "Visuaalsed kaardid ja interaktiivsed graafikud teevad andmed arusaadavaks.",
                icon: <FaMapMarkedAlt className="text-teal-600 text-xl" />,
                color: "bg-teal-100"
              },
              {
                text: "Aitab teha andmepõhiseid ja läbipaistvaid otsuseid.",
                icon: <FaLightbulb className="text-blue-500 text-xl" />,
                color: "bg-blue-100"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`relative flex items-start gap-4 rounded-2xl shadow-lg p-6 bg-white hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 ${item.color}`}
                style={{
                  marginTop: idx % 2 === 1 ? '2.5rem' : undefined,
                  zIndex: 10 - idx
                }}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border-2 border-white -ml-8 mr-2 z-20">
                  {item.icon}
                </div>
                <div className="text-neutral-800 text-base font-medium leading-snug">
                  {item.text}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Decorative SVG or gradient for background effect */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <svg width="100%" height="100%" className="opacity-10" style={{position:'absolute',top:0,left:0}}>
              <defs>
                <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#bg-gradient)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center"
        >
          Portaali põhifunktsioonid
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <FaSearch className="text-teal-600 text-2xl" />, title: "Piirkondade otsing ja kaardilt valik", desc: "Leia kiiresti sobiv piirkond otsingu või interaktiivse kaardi abil." },
            { icon: <FaChartBar className="text-teal-600 text-2xl" />, title: "Hinnagraafikud ja tehingute statistika", desc: "Vaata hinnadünaamikat ja tehingute arvu ajas graafikutel." },
            { icon: <FaBuilding className="text-teal-600 text-2xl" />, title: "Hoonestusprofiilid", desc: "Uuri piirkonna hoonestuse vanust, tüüpe ja energiamärgiseid." },
            { icon: <FaInfoCircle className="text-teal-600 text-2xl" />, title: "Võrdlusfunktsioon (tulemas)", desc: "Võrdle kahte piirkonda omavahel ja leia parimad võimalused." }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow flex items-start gap-4"
            >
              <div>{item.icon}</div>
              <div>
                <h3 className="font-semibold text-neutral-800 mb-1">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 py-12 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Alusta andmepõhiste otsustega juba täna!</h2>
          <p className="text-neutral-700 text-base sm:text-lg">
            Sirvi piirkondi, võrdle hindu ja tee teadlikke valikuid Eesti kõige põhjalikuma kinnisvarastatistika portaali abil.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto mx-auto"
          >
            <Link
              to="/piirkond"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Vaata piirkondi
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
