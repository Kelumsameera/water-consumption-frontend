import Header from "./components/Header";
import ProfessionalDashboard from "./pages/HomePage";
import PressurGuageHomePage from "./pages/pressurGuageHomePage";

import {
  Route,
  BrowserRouter as RouterBrowser,
  Routes,
} from "react-router-dom";
import WaterDashboard from "./pages/waterDashboardPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />
      <Routes>
        <Route path="/" element={<ProfessionalDashboard />} />
        <Route path="/water" element={<WaterDashboard />} />
        <Route path="/pressur" element={<PressurGuageHomePage />} />
      </Routes>
    </div>
  );
}
