import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Fasal<span className="brand-dot">.</span>Mitra
      </Link>
      <div className="navbar-links">
        <NavLink to="/crop-advisory" className={({ isActive }) => isActive ? 'active' : ''}>🌱 Crop</NavLink>
        <NavLink to="/weather"       className={({ isActive }) => isActive ? 'active' : ''}>🌤 Weather</NavLink>
        <NavLink to="/mandi"         className={({ isActive }) => isActive ? 'active' : ''}>📊 Mandi</NavLink>
        <NavLink to="/schemes"       className={({ isActive }) => isActive ? 'active' : ''}>📋 Schemes</NavLink>
      </div>
    </nav>
  );
}