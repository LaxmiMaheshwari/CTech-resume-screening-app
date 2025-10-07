// components/MatchScore.tsx
import React, { useState } from "react";
import { MatchScoreResponse } from "../../types/resume";
import "./index.css";
import { useAppSelector } from "../../hooks";

interface MatchScoreProps {
  result: MatchScoreResponse | null;
}

const MatchScore = () => {
  const matchData = useAppSelector((state) => state.match.data);

  if (!matchData) {
    return (
      <p className="score-card">
        No match data found. Please upload your resume first.
      </p>
    );
  }

  const { overall_match_percentage, breakdown, message } = matchData;
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="score-card">
      <h2>Match Score</h2>

      <div className="score-circle">
        <span> {overall_match_percentage}%</span>
      </div>

      <button className="toggle-btn" onClick={toggleExpanded}>
        {expanded ? "Hide Details ▲" : "Show Details ▼"}
      </button>

      {expanded && (
        <div className="details">
          <h3>Breakdown</h3>
          {/* {breakdown.map((item, idx) => ( */}
          <div className="detail-item">
            <div className="label">
              Skills Score:{" "}
              <span className="value">{breakdown.skills_score}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${breakdown.skills_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label">
              Experience Score:{" "}
              <span className="value">{breakdown.experience_score}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${breakdown.experience_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label">
              Education Score:{" "}
              <span className="value">{breakdown.education_score}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${breakdown.education_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label">
              Semantic Score:{" "}
              <span className="value">{breakdown.semantic_score}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${breakdown.semantic_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{breakdown.description}</p> */}
            <p>
              <em>{message}</em>
            </p>
          </div>

          {/* ))} */}
        </div>
      )}
    </div>
  );
};

export default MatchScore;
