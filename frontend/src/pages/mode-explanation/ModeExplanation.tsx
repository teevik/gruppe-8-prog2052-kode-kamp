import { useEffect, useState } from "react";
import { GameMode, MODE_DESCRIPTION } from "../../../../shared/const";
import "./ModeExplanation.css";

interface modeExplanationProps {
  gameMode: GameMode;
  time: number;
}

/**
 * The ModeExplanation component displays a modal with
 * information about the game mode the user has chosen.
 *
 * @param {GameMode} gameMode - The game mode the user has chosen.
 * @param {number} time - The time the user has to finish the challenge.
 */
export default function ModeExplanation({
  gameMode,
  time,
}: {
  gameMode: GameMode;
  time: number;
}) {
  const [totalTime, setTotalTime] = useState(0);

  // Update the total time when the time changes
  useEffect(() => {
    if (time > totalTime) {
      setTotalTime(time);
    }
  }, [time]);

  // If the game mode is not set, don't render anything
  if (!gameMode) {
    return null;
  }

  return (
    <>
      <div className="wrapper">
        <div className="centerBox">
          <h1>{gameMode}</h1>
          <h3>{MODE_DESCRIPTION[gameMode]}</h3>
          <h1>{time}</h1>
        </div>
      </div>

      <div
        id="timerDiv"
        style={{
          // Update the animation duration when the total time changes
          animationDuration: `${totalTime}s`,
        }}
      />
    </>
  );
}


