import { useEffect, useState } from "react";
import "./ModeExplanation.css";
import { GameMode, MODE_DESCRIPTION } from "../../../../shared/const";

interface modeExplanationProps {
  gameMode: GameMode;
  time: number;
}

export function MockModeExplanation() {
  const [time, setTime] = useState<number>(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : time));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <ModeExplanation gameMode="First to finish" time={time ? time : 0} />;
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
