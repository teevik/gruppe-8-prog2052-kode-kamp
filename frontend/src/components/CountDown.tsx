import { useEffect, useState } from "react";
import "./CountDown.css";

interface CountDownProps {
  initialCounter: number;
}

export default function CountDown({ initialCounter }: CountDownProps) {
  const [_, setCountdown] = useState<number>(initialCounter);
  const [timer, setTimer] = useState<string>("");

  useEffect(() => {
    //Interval to update countdown (initialCounter is the amount of seconds)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        setTimer(formatSeconds(prev - 1));
        return prev - 1;
      });
    }, 1000);

    //Set timeout to clear the interval
    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return <p className="countDown">{timer}</p>;
}

function formatSeconds(countdownSeconds: number): string {
  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds - minutes * 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export { formatSeconds };
