import React, { useState, useEffect } from 'react';
import { getCropAdvisory, getDistricts } from '../utils/api';

const SOILS = ['Red Sandy Loam', 'Black Cotton', 'Alluvial', 'Laterite', 'Sandy', 'Clay'];
const SEASONS = ['Kharif (June–October)', 'Rabi (November–March)', 'Zaid (March–June)'];

export default function CropAdvisory() {
  const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({ district: '', soil_type: '', season: '', land_size: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDistricts().then(r => setDistricts(r.data.districts)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.district || !form.soil_type || !form.season || !form.land_size) {
      setError('Please fill all fields'); return;
    }
    setError(''); setLoading(true); setResult(null);
    try {
      const res = await getCropAdvisory(form);
      setResult(res.data);
    } catch (e) {
      setError('Failed to get advisory. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page container">
      <div className="page-header">
        <div className="page-eyebrow">AI Powered</div>
        <h1 className="page-title">Crop Advisory</h1>
        <p className="page-subtitle">Tell us about your farm and get intelligent crop recommendations</p>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>District</label>
            <select name="district" value={form.district} onChange={handleChange}>
              <option value="">Select your district</option>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <select name="soil_type" value={form.soil_type} onChange={handleChange}>
              <option value="">Select soil type</option>
              {SOILS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Season</label>
            <select name="season" value={form.season} onChange={handleChange}>
              <option value="">Select season</option>
              {SEASONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Land Size (acres)</label>
            <input type="number" name="land_size" placeholder="e.g. 2.5" value={form.land_size} onChange={handleChange} min="0.1" />
          </div>
        </div>
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Analyzing your farm...' : '🌱 Get Crop Advisory'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>AI is analyzing your farm details...</p>
        </div>
      )}

      {result && (
        <>
          {/* NEW: AI Reasoning Steps Display */}
          {result.reasoning_steps && result.reasoning_steps.length > 0 && (
            <div style={{
              marginBottom: "24px",
              padding: "20px",
              backgroundColor: "#f0f8ff",
              borderRadius: "8px",
              borderLeft: "4px solid #2d7a4a",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{
                color: "#2d7a4a",
                marginTop: 0,
                marginBottom: "12px",
                fontSize: "16px",
                fontWeight: "600"
              }}>
                🤖 AI Reasoning Process
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.reasoning_steps.map((step, idx) => (
                  <div key={idx} style={{
                    margin: "0",
                    fontSize: "14px",
                    color: "#2d3e3e",
                    lineHeight: "1.5",
                    animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`
                  }}>
                    {step}
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(-5px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          )}

          <div className="advice-box">
            <div className="advice-box-label">General Advice</div>
            <p>{result.general_advice}</p>
            <div className="advice-box-sowing">🗓️ Best Sowing: {result.best_sowing_time}</div>
          </div>

          <div className="page-eyebrow" style={{ marginBottom: 16 }}>Recommended Crops ({result.recommended_crops?.length})</div>
          <div className="result-grid">
            {result.recommended_crops?.map((crop, i) => (
              <div className="crop-card" key={i}>
                <div className="crop-card-number">#{i + 1}</div>
                <div className="crop-name">{crop.name}</div>
                <div className="crop-telugu">{crop.telugu_name}</div>
                <p className="crop-reason">{crop.reason}</p>
                <div className="crop-stats">
                  <div className="crop-stat">
                    <div className="crop-stat-label">Duration</div>
                    <div className="crop-stat-value">⏱️ {crop.duration}</div>
                  </div>
                  <div className="crop-stat">
                    <div className="crop-stat-label">Water Need</div>
                    <div className="crop-stat-value">💧 {crop.water_need}</div>
                  </div>
                  <div className="crop-stat" style={{ gridColumn: '1 / -1' }}>
                    <div className="crop-stat-label">Expected Yield</div>
                    <div className="crop-stat-value">🎯 {crop.expected_yield}</div>
                  </div>
                </div>
                {crop.tips?.length > 0 && (
                  <>
                    <div className="crop-tips-title">Farming Tips</div>
                    <ul className="crop-tips">
                      {crop.tips.map((t, j) => <li key={j}>{t}</li>)}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}