// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RegionOverview from "./pages/RegionOverview";
import RegionSelect from "./pages/RegionSelect";
import PriceStats from "./pages/PriceStats";
import HPIPage from "./pages/HPIPage";
import MaakondList from "./pages/MaakondList";
// import PriceChartPage from "./pages/PriceChartPage"; // ✅ uus

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/maakond" element={<MaakondList />} />
          <Route path="/piirkond" element={<RegionSelect />} />
          <Route path="/piirkond/:name" element={<RegionOverview />} />
          <Route path="/hinnad" element={<PriceStats />} />
          <Route path="/hpi" element={<HPIPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
