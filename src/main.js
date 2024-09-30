import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/sidebar";
import DashboardContent from "./pages/dashboardContent";
import Patient from "./pages/patient";
import Community from "./pages/community";
import AiAssistant from "./pages/aiAssistant";

export default function main({ onLogout }) {
  return (
    <div className="flex h-full w-screen font-mono overflow-x-hidden">
      {/* <div className=""> */}
        <Sidebar onLogout={() => onLogout()} />
      {/* </div> */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/community" element={<Community />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="*" element={<Navigate to="/" />} />{" "}
          {/* Optional: Redirect to dashboard if route not found */}
        </Routes>
      </div>
    </div>
  );
}
