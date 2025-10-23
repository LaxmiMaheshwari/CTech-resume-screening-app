import React from "react";
import "./index.css";
type Spinner = {
  loader: boolean;
  backgroundColor?: string;
  border?: string;
};
const CircularSpinner: React.FC<Spinner> = ({
  loader,
  backgroundColor,
  border,
}) => {
  return (
    <>
      {loader && (
        <div
          className="loader-container"
          style={{
            backgroundColor: `${backgroundColor ?? "rgba(0, 0, 0, 0.7)"}`,
          }}
        >
          <div
            className="loader "
            style={{
              border: `5px solid ${border ?? "#fff"}`,
            }}
          ></div>
        </div>
      )}
    </>
  );
};

export default CircularSpinner;
