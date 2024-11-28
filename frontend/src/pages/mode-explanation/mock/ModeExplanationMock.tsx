import { useEffect, useState } from "react";
import ModeExplanation from "../ModeExplanation";

export default function MockModeExplanation() {
  const [time, setTime] = useState<number>(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : time));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <ModeExplanation gameMode="First to finish" time={time ? time : 0} />;
}
