import React from "react";

type Props = {
  health: number;
  score: number;
};

export const PlayerStatus: React.FC<Props> = ({ health, score }) => {
  return (
    <div
      style={{
        color: "white",
        padding: "8px 10px",
        borderRadius: 6,
      }}
    >
      <div style={{ fontWeight: 700 }}>Player</div>
      <div>Health: {health}</div>
      <div>Score: {score}</div>
    </div>
  );
};
