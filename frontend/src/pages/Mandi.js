import React, { useState, useEffect } from 'react';
import { getMandiPrices, getDistricts } from '../utils/api';

const COMMODITIES = [
  'Rice', 'Wheat', 'Maize', 'Groundnut', 'Cotton', 'Sunflower',
  'Chilli', 'Onion', 'Tomato', 'Banana', 'Turmeric', 'Tobacco',
  'Jowar', 'Bajra', 'Sugarcane', 'Bengal Gram', 'Black Gram', 'Green Gram'
];

const perKg = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  return (n / 100).toFixed(1);
};

export default function Mandi() {
  const [districts, setDistricts] = useState([]);
  const [commodity, setCommodity] = useState('');
  const [district, setDistrict] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDistricts().then(r => setDistricts(r.data.districts)).catch(() => {});
  }, []);

  const handleFetch = async () => {
    if (!commodity) { setError('Please select a commodity'); return; }
    setError(''); setLoading(true); setData(null);
    try {
      const res = await getMandiPrices(commodity, district);
      setData(res.data);
    } catch (e) {
      setError('Failed to fetch prices. Try again.');
    } finally { setLoading(false); }
  };

  const getPrice = (row, keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
    }
    return '—';
  };

  return (
    <div className="page container">
      <h1 className="page-title">📊 Mandi Prices</h1>
      <p className="page-subtitle">Wholesale market prices from Andhra Pradesh mandis</p>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label>Commodity</label>
            <select value={commodity} onChange={e => setCommodity(e.target.value)}>
              <option value="">Select Commodity</option>
              {COMMODITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>District (optional)</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" onClick={handleFetch} disabled={loading}>
          {loading ? '⏳ Fetching...' : '📊 Get Prices'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Fetching mandi prices...</p>
        </div>
      )}

      {data && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h3 style={{ color: 'var(--green-dark)', marginBottom: 4 }}>
                {data.commodity} — Market Prices
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>
                {data.district ? `District: ${data.district}` : 'All AP Districts'}
              </p>
            </div>
            <span className={`badge ${data.source === 'live' ? 'badge-green' : 'badge-amber'}`}>
              {data.source === 'live' ? '🟢 Live Data' : '🤖 AI Estimated'}
            </span>
          </div>

          {/* Unit explanation */}
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            background: 'var(--green-pale)', borderRadius: 10,
            padding: '10px 16px', marginBottom: 14, fontSize: '0.88rem'
          }}>
            <span>📦 <strong>1 Quintal = 100 kg</strong></span>
            <span>💡 Divide by 100 to get price per kg</span>
            <span>🏷️ These are wholesale prices (farmer selling price)</span>
          </div>

          {data.source === 'ai_estimated' && (
            <div className="alert alert-info" style={{ marginBottom: 14 }}>
              ℹ️ Live govt data unavailable. Showing AI-estimated prices based on current market trends. <strong>Verify with your local mandi before selling.</strong>
            </div>
          )}

          {data.prices?.length === 0 ? (
            <div className="alert alert-info">No price data found. Try a different commodity.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="mandi-table">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>District</th>
                    <th>Variety</th>
                    <th>Min ₹/quintal<br/><span style={{fontWeight:400,fontSize:'0.78rem'}}>(per 100kg)</span></th>
                    <th>Max ₹/quintal<br/><span style={{fontWeight:400,fontSize:'0.78rem'}}>(per 100kg)</span></th>
                    <th>Modal ₹/quintal<br/><span style={{fontWeight:400,fontSize:'0.78rem'}}>(per 100kg)</span></th>
                    <th>Per kg (approx)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prices.map((row, i) => {
                    const modal = getPrice(row, ['modal_price', 'Modal Price', 'modalPrice']);
                    const min = getPrice(row, ['min_price', 'Min Price', 'minPrice']);
                    const max = getPrice(row, ['max_price', 'Max Price', 'maxPrice']);
                    return (
                      <tr key={i}>
                        <td>{getPrice(row, ['market', 'Market'])}</td>
                        <td>{getPrice(row, ['district', 'District'])}</td>
                        <td>{getPrice(row, ['variety', 'Variety'])}</td>
                        <td style={{ color: 'var(--green-dark)', fontWeight: 600 }}>₹{min}</td>
                        <td style={{ color: '#b00020', fontWeight: 600 }}>₹{max}</td>
                        <td style={{ fontWeight: 700, color: 'var(--amber)' }}>₹{modal}</td>
                        <td style={{ fontWeight: 600, color: 'var(--sky)' }}>
                          ≈ ₹{perKg(modal)}/kg
                        </td>
                        <td>{getPrice(row, ['arrival_date', 'Arrival Date', 'arrivalDate'])}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}