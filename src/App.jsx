import Header from "./components/Header";
import ProfessionalDashboard from "./pages/professionalDashboardPage";
import PressurGuageHomePage from "./pages/pressurGuageHomePage";

import {
  Route,
  BrowserRouter as RouterBrowser,
  Routes,
} from "react-router-dom";
import WaterDashboard from "./pages/waterDashboardPage";
import PressureDatabase from "./pages/PressureDatabase";
import PressureChart from "./pages/PressureChart";
import HistoryChart from "./pages/HistoryChart";
import HomePage from "./pages/HomePage";
import WaterTankDatabase from "./pages/WaterTankDatabase";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/water" element={<WaterDashboard />} />
        <Route path="/pressur" element={<PressurGuageHomePage />} />
        <Route path="/database" element={<PressureDatabase />} />
        <Route path="/chart" element={<PressureChart />} />
        <Route path="/history" element={<HistoryChart />} />
        <Route path="/waterdb" element={<WaterTankDatabase />} />
      </Routes>
    </div>
  );
}
