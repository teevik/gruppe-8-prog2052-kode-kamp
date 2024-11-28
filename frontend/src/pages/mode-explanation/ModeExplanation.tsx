import { useEffect, useState } from "react";
import { GameMode, MODE_DESCRIPTION } from "../../../../shared/const";
import "./ModeExplanation.css";

interface modeExplanationProps {
  gameMode: GameMode;
  time: number;
}

export default function ModeExplanation({
  gameMode,
  time,
}: modeExplanationProps) {
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (time > totalTime) {
      setTotalTime(time);
    }
  }, [time]);

  return (
    <>
      {gameMode && (
        <div className="wrapper">
          <div className="centerBox">
            <h1>{gameMode}</h1>
            <h3>{MODE_DESCRIPTION[gameMode]}</h3>
            <h1>{time}</h1>
          </div>
        </div>
      )}

      <div
        id="timerDiv"
        style={{
          animationDuration: `${totalTime}s`,
        }}
      />
    </>
  );
}
