
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(25 * 60);
  };

  return (
    <div className="container">
      <h1>Focus Timer</h1>
      <p>Stay focused. One task at a time.</p>

      <div className="timer">{formatTime(seconds)}</div>

      <div className="buttons">
        <button onClick={() => setIsRunning(true)} disabled={isRunning || seconds === 0}>
          Start
        </button>

        <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
          Pause
        </button>

        <button onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
