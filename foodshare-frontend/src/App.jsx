import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* 👈 This handles the "/" route */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Optional: handle 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
