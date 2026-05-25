import React, { useState, useEffect } from 'react';
import { getWeather, getDistricts } from '../utils/api';

const WMO = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌧️',55:'🌧️',61:'🌧️',63:'🌧️',65:'⛈️',
  71:'🌨️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️'
};

export default function Weather() {
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDistricts().then(r => setDistricts(r.data.districts)).catch(() => {});
  }, []);

  const handleFetch = async () => {
    if (!district) { setError('Please select a district'); return; }
    setError(''); setLoading(true); setData(null);
    try {
      const res = await getWeather(district);
      setData(res.data);
    } catch (e) {
      setError('Failed to fetch weather. Try again.');
    } finally { setLoading(false); }
  };

  const fmtDate = (s) => new Date(s).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  const outlookClass = (o='') => {
    const l = o.toLowerCase();
    if (l === 'good') return 'outlook-good';
    if (l === 'poor') return 'outlook-poor';
    return 'outlook-moderate';
  };

  return (
    <div className="page container">
      <div className="page-header">
        <div className="page-eyebrow">Real-time Data</div>
        <h1 className="page-title">Weather & Farming Tips</h1>
        <p className="page-subtitle">7-day forecast with AI-powered farming advice for your district</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            <label>District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">Select your district</option>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleFetch} disabled={loading} style={{ marginBottom: 0 }}>
            {loading ? '⏳ Loading...' : '🌤️ Get Weather'}
          </button>
        </div>
        {error && <div className="alert alert-error" style={{ marginTop: 16 }}>⚠️ {error}</div>}
      </div>

      {loading && <div className="loading"><div className="spinner" /><p>Fetching weather data...</p></div>}

      {data && (
        <>
          <div className="weather-hero">
            <div className="weather-location">{district}</div>
            <div className="weather-label">Current Conditions</div>
            <div className="weather-temp">{data.current_weather?.temperature}°C</div>
            <div className="weather-wind">💨 {data.current_weather?.windspeed} km/h wind speed</div>
          </div>

          <div className="page-eyebrow" style={{ marginBottom: 12 }}>7-Day Forecast</div>
          <div className="forecast-grid">
            {data.forecast?.dates?.map((date, i) => (
              <div className="forecast-day" key={i}>
                <div className="forecast-date">{fmtDate(date)}</div>
                <div className="forecast-icon">{WMO[data.forecast?.weathercode?.[i]] || '🌡️'}</div>
                <div className="forecast-temp">
                  {data.forecast?.max_temp?.[i]}° <span>/ {data.forecast?.min_temp?.[i]}°</span>
                </div>
                <div className="forecast-rain">💧 {data.forecast?.rainfall?.[i] ?? 0}mm</div>
              </div>
            ))}
          </div>

          {data.ai_tips && (
            <div className="ai-tips-card">
              <div className="ai-tips-header">
                <div className="ai-tips-title">🤖 AI Farming Tips</div>
                <span className={`outlook-pill ${outlookClass(data.ai_tips.overall_outlook)}`}>
                  {data.ai_tips.overall_outlook} Outlook
                </span>
              </div>

              <div className="tips-grid">
                <div className="tip-item">
                  <span className="tip-icon">💧</span>
                  <div className="tip-text"><strong>Irrigation:</strong> {data.ai_tips.irrigation_advice}</div>
                </div>
                {data.ai_tips.pest_alert && data.ai_tips.pest_alert !== 'No specific alert' && (
                  <div className="tip-item" style={{ background: '#fff0f0', border: '1px solid #ffc0c0' }}>
                    <span className="tip-icon">🐛</span>
                    <div className="tip-text" style={{ color: '#b00020' }}><strong>Pest Alert:</strong> {data.ai_tips.pest_alert}</div>
                  </div>
                )}
              </div>

              <div className="page-eyebrow" style={{ marginBottom: 10 }}>Farming Tips</div>
              <div className="tips-grid">
                {data.ai_tips.farming_tips?.map((tip, i) => (
                  <div className="tip-item" key={i}>
                    <span className="tip-icon">✅</span>
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}