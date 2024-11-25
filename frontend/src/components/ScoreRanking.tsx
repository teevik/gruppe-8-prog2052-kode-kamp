import React from "react";
import "./ScoreRanking.css";
import { milestones } from "../ranking";
import { MAX_POINTS } from "../../../shared/const";

interface ScoreRankingProps {
  progress: number;
}

export function ScoreRanking({ progress }: ScoreRankingProps) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${(progress / MAX_POINTS) * 100}%` }}
        ></div>
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="milestone"
            style={{
              left: `${(index / (milestones.length - 1)) * 100}%`,
            }}
          >
            <div className="milestone-icon">
              {index <= progress / (MAX_POINTS / milestones.length) ? (
                <span>&#10003;</span> // Checkmark for completed milestones
              ) : (
                <span></span> // Placeholder for incomplete milestones
              )}
            </div>
            <div className="milestone-content">
              <img src={milestone.imageSrc} alt={milestone.text} />
              <p>{milestone.text}</p>
              <p>{Math.floor((MAX_POINTS / milestones.length) * index)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
