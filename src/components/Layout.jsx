import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('nav') && !event.target.closest('button')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const navLinkClass = (path) =>
    `px-4 py-3 rounded-md transition font-medium w-full text-left block md:inline md:w-auto md:text-center ${
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
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition-colors">
            KinnisvaraRadar
          </Link>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
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
          <nav className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pb-4 animate-fade-in-down">
            <div className="py-2 space-y-1">
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
            </div>
          </nav>
        )}
      </header>

      {/* SISU */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
