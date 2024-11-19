import React from "react";
import Navbar from "./Navbar/Navbar.jsx";
import "./Layout.css";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const noNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="layout">
      {shouldShowNavbar && <Navbar />}
      
      <main className="content">
        <Outlet />
      </main>

      {shouldShowNavbar && 
      <footer className="footer">
        <p>&copy; 2024 SUtore. All rights reserved.</p>
      </footer>}
    </div>
  );
};

export default Layout;
