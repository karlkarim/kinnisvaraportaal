import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RegionOverview from "./pages/RegionOverview";
import RegionSelect from "./pages/RegionSelect";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/piirkond" element={<RegionSelect />} />
          <Route path="/piirkond/:name" element={<RegionOverview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
