import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-md transition font-medium w-full text-left block md:inline md:w-auto md:text-center ${
      pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* NAV */}
      <header className="bg-white/90 backdrop-blur shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="text-xl font-bold text-blue-600 tracking-tight">
            Kinnisvaraportaal
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Ava menüü"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex gap-4">
            <Link to="/" className={navLinkClass("/")}>Avaleht</Link>
            <Link to="/piirkond" className={navLinkClass("/piirkond")}>Piirkonna ülevaade</Link>
          </nav>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-100 shadow px-4 pb-4 animate-fade-in-down">
            <Link
              to="/"
              className={navLinkClass("/")}
              onClick={() => setMenuOpen(false)}
            >
              Avaleht
            </Link>
            <Link
              to="/piirkond"
              className={navLinkClass("/piirkond")}
              onClick={() => setMenuOpen(false)}
            >
              Piirkonna ülevaade
            </Link>
          </nav>
        )}
      </header>

      {/* SISU */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
