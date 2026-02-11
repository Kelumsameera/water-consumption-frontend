import Navbar from "./components/Navbar";

import ProfessionalDashboard from "./pages/professionalDashboardPage";
import PressurGuageHomePage from "./pages/pressurGuageHomePage";
import WaterDashboard from "./pages/waterDashboardPage";
import PressureDatabase from "./pages/PressureDatabase";
import PressureChart from "./pages/PressureChart";
import HistoryChart from "./pages/HistoryChart";
import HomePage from "./pages/HomePage";
import WaterTankDatabase from "./pages/WaterTankDatabase";

import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProfessionalDashboard />} />
        <Route path="/water" element={<WaterDashboard />} />
        <Route path="/pressure" element={<PressurGuageHomePage />} />
        <Route path="/database" element={<PressureDatabase />} />
        <Route path="/chart" element={<PressureChart />} />
        <Route path="/history" element={<HistoryChart />} />
        <Route path="/waterdb" element={<WaterTankDatabase />} />
      </Routes>
    </>
  );
}
