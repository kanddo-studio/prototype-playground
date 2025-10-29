import React from "react";

type Props = {
  health: number;
  score: number;
};

export const PlayerStatus: React.FC<Props> = ({ health, score }) => {
  return (
    <div>
      <div style={{ fontWeight: 700 }}>Player</div>
      <div>Health: {health}</div>
      <div>Score: {score}</div>
    </div>
  );
};
