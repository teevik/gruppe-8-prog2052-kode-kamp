import { useEffect, useState } from "react";
import "./CountDown.css";

interface CountDownProps {
  initialCounter: number;
}

/**
 * CountDown is a React component for a countdown timer
 * that displays the number of minutes and seconds left.
 * @param {number} initialCounter - the initial number of seconds
 * @returns {JSX.Element} a paragraph with the formatted countdown
 */
export default function CountDown({ initialCounter }: CountDownProps) {
  const [countdown, setCountdown] = useState<number>(initialCounter);
  const [timer, setTimer] = useState<string>("");

  useEffect(() => {
    // Interval to update countdown (initialCounter is the amount of seconds)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        setTimer(formatSeconds(prev - 1));
        return prev - 1;
      });
    }, 1000);

    // Set timeout to clear the interval
    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return <p className="countDown">{timer}</p>;
}

/**
 * Format the countdown seconds to a string in the format "Xm Ys"
 * @param {number} countdownSeconds - the number of seconds to format
 * @returns {string} the formatted countdown string
 */
function formatSeconds(countdownSeconds: number): string {
  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds - minutes * 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Export the formatSeconds function so it can be used in other components
 */
export { formatSeconds };


