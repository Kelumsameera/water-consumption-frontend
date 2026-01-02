import Header from "./components/Header";
import RealtimeDashboard from "./pages/RealtimeDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <RealtimeDashboard />
      </main>
    </div>
  );
}
