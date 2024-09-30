import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Main from "./main";

import Auth from "./components/auth";

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = () => {
    console.log("logged in...");
    localStorage.setItem("isAuthenticated", true);
    setIsAuthenticated(true); // Set authentication to true when the user logs in
  };

  // Function to handle logout (optional)
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    setIsAuthenticated(false); // Reset authentication when the user logs out
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    // <Router>
      <Routes>
         {/* <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/user" />
            ) : (
              <Auth onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/user/*"
          element={
            isAuthenticated ? (
              <Main onLogout={() => handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        /> */}
        <Route path="/" element={<Auth/>}/>
        <Route path="/user/*" element={<Main/>}/>
      </Routes>
    // </Router>
  );
}

export default App;
