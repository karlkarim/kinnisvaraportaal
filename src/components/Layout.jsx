import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const { pathname } = useLocation();

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-md transition font-medium ${
      pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* NAV */}
      <header className="bg-white/90 backdrop-blur shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="text-xl font-bold text-blue-600 tracking-tight">
            Kinnisvaraportaal
          </div>

          {/* Nav links */}
          <nav className="flex gap-4">
            <Link to="/" className={navLinkClass("/")}>
              Avaleht
            </Link>
            <Link to="/piirkond" className={navLinkClass("/piirkond")}>
              Piirkonna ülevaade
            </Link>
          </nav>
        </div>
      </header>

      {/* SISU */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
