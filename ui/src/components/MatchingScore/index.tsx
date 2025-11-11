// components/MatchScore.tsx
import { useState } from "react";
import "./index.css";
import { useAppSelector } from "../../hooks";
import CircularProgress from "../CircularProgress";

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
    <div
      // className="score-card "
      className="mx-auto mt-12 p-6 bg-[#313233] shadow-lg rounded-lg text-white"
      style={{
        width: " clamp(10px, 40vw, 2000px)",
        padding: " clamp(4px, 1.3vw, 500px)",
        // height: " clamp(4px, 30vw, 5000px)",
      }}
    >
      <h2 className="text-white mb-2">Match Score</h2>

      {/* <div className="score-circle">
        <span> {overall_match_percentage}%</span>
      </div> */}

      <CircularProgress percentage={overall_match_percentage} size={120} />

      <button
        // className="toggle-btn mt-2"
        onClick={toggleExpanded}
        className="mt-2 bg-[#043C8B] toggle-btn text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        {expanded ? "Hide Details ▲" : "Show Details ▼"}
      </button>

      {expanded && (
        <div className="details text-white">
          <h3 className="text-white">Breakdown</h3>
          {/* {breakdown.map((item, idx) => ( */}
          <div className="detail-item">
            <div className="label text-white">
              Skills Score:{" "}
              <span className="value">{breakdown.skills_score}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.skills_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Experience Score:{" "}
              <span className="value text-white">
                {breakdown.experience_score}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.experience_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Education Score:{" "}
              <span className="value text-white">
                {breakdown.education_score}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.education_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Semantic Score:{" "}
              <span className="value text-white">
                {breakdown.semantic_score}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.semantic_score}%` }}
              ></div>
            </div>

            {/* <p className="extra">{breakdown.description}</p> */}
            <p className="mt-2">
              <em className="text-white"> {message}</em>
            </p>
          </div>

          {/* ))} */}
        </div>
      )}
    </div>
  );
};

export default MatchScore;
