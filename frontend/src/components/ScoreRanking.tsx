/**
 * The ScoreRanking component displays a progress bar
 * that shows the progress towards the next rank.
 *
 * The component takes a single prop, `progress`, which
 * is the current score of the user.
 */

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
          // The width of the fill is calculated based on the progress
          style={{ width: `${(progress / MAX_POINTS) * 100}%` }}
        ></div>
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="milestone"
            // The position of the milestone is calculated based on the index
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
              <p>
                {/* The points required for the milestone is calculated based on the index */}
                {Math.floor((MAX_POINTS / milestones.length) * index)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


