import React from 'react';
import Navbar from './NavigationBar/navbar';
import "./Layout.css";
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  // Define routes where you do NOT want to show the navbar
  const noNavbarRoutes = ['/login', '/register'];

  // Check if the current route is in the noNavbarRoutes array
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="layout">
      {shouldShowNavbar && <Navbar />}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
