import { useEffect, useState } from "react";
import "./ModeExplanation.css";

interface modeExplanationProps {
  gameMode: string;
  time: number;
  explanation: string;
}

export function MockModeExplanation() {
  const [time, setTime] = useState<number>(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : time));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ModeExplanation
      gameMode="First to Finish"
      time={time ? time : 10}
      explanation="Makka Pakka make the code go Fasta"
    />
  );
}

export default function ModeExplanation({
  gameMode,
  time,
  explanation,
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
            <h3>{explanation}</h3>
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
