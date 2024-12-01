import { useState, useEffect } from 'react';

export function useTime() {
  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
}

function getFormattedTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}