import React, { useState } from 'react';
import './MatchingScore.css';

function MatchingScore({ score, breakdown }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="score-card">
      <h2>Matching Score</h2>
      <div className="score-circle">
        <span>{score}%</span>
      </div>

      <button className="toggle-btn" onClick={toggleExpanded}>
        {expanded ? 'Hide Details ▲' : 'Show Details ▼'}
      </button>

      {expanded && (
        <div className="details">
          <h3>Breakdown</h3>
          {breakdown.map((item, idx) => (
            <div className="detail-item" key={idx}>
              <div className="label">
                {item.label}
                <span className="value">{item.score}%</span>
              </div>
              <div className="bar-container">
                <div className="bar" style={{ width: `${item.score}%` }}></div>
              </div>
              <p className="extra">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchingScore;
