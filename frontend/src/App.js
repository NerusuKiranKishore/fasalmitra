import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CropAdvisory from './pages/CropAdvisory';
import Weather from './pages/Weather';
import Mandi from './pages/Mandi';
import Schemes from './pages/Schemes';

function AppInner() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/home"          element={<Home />} />
        <Route path="/crop-advisory" element={<CropAdvisory />} />
        <Route path="/weather"       element={<Weather />} />
        <Route path="/mandi"         element={<Mandi />} />
        <Route path="/schemes"       element={<Schemes />} />
        <Route path="*"              element={<Landing />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}