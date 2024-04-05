import React, { useState, useEffect } from "react";

const Clock = ({ className }: { className?: string }) => {
  // Initialize state with the current time
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Create a timer that updates the state with the new time every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clear the interval on component unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Format the time as HH:MM:SS
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return <div className={className}>{formattedTime}</div>;
};

export default Clock;
