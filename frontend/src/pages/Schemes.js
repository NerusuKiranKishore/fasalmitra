import React, { useState, useEffect } from 'react';
import { getSchemes } from '../utils/api';

const CATEGORIES = [
  { key: 'all',       label: 'All Schemes' },
  { key: 'income',    label: '💰 Income Support' },
  { key: 'insurance', label: '🛡️ Crop Insurance' },
  { key: 'loans',     label: '💳 Loans & Credit' },
  { key: 'seeds',     label: '🌱 Seeds & Inputs' },
  { key: 'equipment', label: '🚜 Equipment' },
  { key: 'irrigation',label: '💧 Irrigation' },
  { key: 'organic',   label: '🌿 Organic' },
];

export default function Schemes() {
  const [category, setCategory] = useState('all');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSchemes(category)
      .then(r => setSchemes(r.data.schemes))
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page container">
      <div className="page-header">
        <div className="page-eyebrow">Central & State Government</div>
        <h1 className="page-title">Farmer Schemes</h1>
        <p className="page-subtitle">Find eligibility, benefits, documents, and apply directly</p>
      </div>

      <div className="filter-tabs">
        {CATEGORIES.map(c => (
          <button key={c.key} className={`filter-tab ${category === c.key ? 'active' : ''}`} onClick={() => setCategory(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {loading && <div className="loading"><div className="spinner" /><p>Loading schemes...</p></div>}
      {!loading && schemes.length === 0 && <div className="alert alert-info">No schemes found in this category.</div>}

      {schemes.map(scheme => (
        <div className="scheme-card" key={scheme.id}>
          <div className="scheme-top">
            <div className="scheme-icon-wrap">{scheme.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="scheme-name">{scheme.name}</div>
              <div className="scheme-telugu">{scheme.telugu_name}</div>
            </div>
            <span className="badge badge-green scheme-cat-badge">
              {CATEGORIES.find(c => c.key === scheme.category)?.label?.replace(/^[^\s]+\s/, '') || scheme.category}
            </span>
          </div>

          <p className="scheme-desc">{scheme.description}</p>

          <div className="scheme-benefit">
            ✅ {scheme.benefit}
          </div>

          <div className="scheme-grid">
            <div>
              <div className="scheme-section-label">Eligibility</div>
              <p className="scheme-eligibility">{scheme.eligibility}</p>
            </div>
            <div>
              <div className="scheme-section-label">Documents Needed</div>
              <ul className="scheme-docs">
                {scheme.documents.map(doc => <li key={doc}>{doc}</li>)}
              </ul>
            </div>
          </div>

          <div className="scheme-footer">
            <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer" className="apply-btn">
              🔗 Apply Now
            </a>
            <span className="scheme-deadline">🗓️ {scheme.deadline}</span>
          </div>
        </div>
      ))}
    </div>
  );
}