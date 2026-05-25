import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🌱', title: 'AI Crop Advisory', desc: 'Know which crops to grow based on your district, soil type, and season — powered by Gemini AI.' },
  { icon: '🌤️', title: 'Weather Forecast', desc: '7-day forecast with smart irrigation tips, pest risk alerts, and field planning advice.' },
  { icon: '📊', title: 'Mandi Prices', desc: 'Real-time commodity prices from AP government mandis — with per-kg breakdown.' },
  { icon: '📋', title: 'Govt Schemes', desc: 'Central and state schemes with eligibility, documents needed, and direct apply links.' },
  { icon: '🏘️', title: 'AP Focused', desc: 'Built specifically for Andhra Pradesh — 15 districts, local crops, and regional context.' },
  { icon: '⚡', title: '100% Free', desc: 'No subscriptions. No hidden fees. Powered entirely by free public APIs and AI.' },
];

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-bg-pattern" />
        <div className="hero-grain" />
        <div className="hero-content">
          <div className="hero-badge">🌾 Built for Andhra Pradesh Farmers</div>
          <h1>Your farming<br /><em>companion</em>, powered<br />by AI</h1>
          <p className="hero-sub">
            Crop advice, live mandi prices, weather insights, and government schemes — all in one place, all free.
          </p>
          <div className="hero-cards">
            <Link to="/crop-advisory" className="hero-card">🌱 Crop Advisory</Link>
            <Link to="/weather"       className="hero-card">🌤️ Weather Tips</Link>
            <Link to="/mandi"         className="hero-card">📊 Mandi Prices</Link>
            <Link to="/schemes"       className="hero-card">📋 Govt Schemes</Link>
          </div>
        </div>
      </div>

      <div className="feature-strip">
        {[
          { icon: '🤖', strong: 'Gemini AI', span: 'Crop intelligence' },
          { icon: '🌦️', strong: 'Open-Meteo', span: 'Live weather data' },
          { icon: '🏛️', strong: 'data.gov.in', span: 'Govt mandi prices' },
          { icon: '📱', strong: 'Mobile Ready', span: 'Works on any device' },
        ].map(f => (
          <div className="feature-strip-item" key={f.strong}>
            <span className="feature-strip-icon">{f.icon}</span>
            <div className="feature-strip-text">
              <strong>{f.strong}</strong>
              <span>{f.span}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="home-features container">
        <div className="home-section-label">Why FasalMitra</div>
        <h2 className="home-section-title">Everything a farmer needs,<br />in one place</h2>
        <p className="home-section-sub">Designed for small and marginal farmers of Andhra Pradesh — simple, accurate, and always free.</p>

        <div className="result-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}