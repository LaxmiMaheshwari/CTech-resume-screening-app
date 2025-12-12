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

  console.log("matchData", matchData);

  // const { overall_match_percentage, breakdown, message } = matchData;
  const { overall_match, breakdown, message } = matchData;

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div
      // className="score-card "
      className=" w-[70%]   text-white"
      style={
        {
          // width: " clamp(10px, 40vw, 2000px)",
          // padding: " clamp(4px, 1.3vw, 500px)",
          // height: " clamp(4px, 30vw, 5000px)",
        }
      }
    >
      {/* <h2 className="text-white mb-2">Match Score</h2> */}

      {/* <div className="score-circle">
        <span> {overall_match_percentage}%</span>
      </div> */}

      <CircularProgress percentage={overall_match} size={120} />

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
              Analytics Experience Score:{" "}
              <span className="value">{breakdown.analytics_experience}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.analytics_experience}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Data Science Experience Score:{" "}
              <span className="value">
                {breakdown.data_science_experience}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.data_science_experience}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Data Engineering Experience Score:{" "}
              <span className="value">
                {breakdown.data_engineering_experience}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.data_engineering_experience}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Technical Skills Score:{" "}
              <span className="value text-white">
                {breakdown.technical_skills}%
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.technical_skills}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Education Score:{" "}
              <span className="value text-white">{breakdown.education}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.education}%` }}
              ></div>
            </div>

            {/* <p className="extra">{item.description}</p> */}
          </div>

          <div className="detail-item">
            <div className="label text-white">
              Soft Skills Score:{" "}
              <span className="value text-white">{breakdown.soft_skills}%</span>
            </div>
            <div className="bar-container">
              <div
                className="bar text-white"
                style={{ width: `${breakdown.soft_skills}%` }}
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
