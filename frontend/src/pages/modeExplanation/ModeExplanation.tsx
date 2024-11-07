import { useEffect, useState } from "react";
import "./ModeExplanation.css";

interface modeExplanationProps {
  gameMode: string;
  time: number;
}

export function MockModeExplanation() {
  const [time, setTime] = useState<number | undefined>(undefined);

  useEffect(() => {
    setTime(30);

    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : time));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // check if timer is done
    if (time === 0) {
    }
  }, [time]);

  return <ModeExplanation gameMode="First to Finish" time={time} />;
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
            <h3>Makka pakka make the code fasta</h3>
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
