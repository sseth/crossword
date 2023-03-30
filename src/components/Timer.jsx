import { useState, useEffect } from "react";

const Timer = ({ reset, setReset }) => {
  const [start, setStart] = useState(Date.now());
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [intervalID, setIntervalID] = useState(null);
  const [display, setDisplay] = useState("00:00");

  const getTime = (startTime) => {
    const t = Math.floor((elapsed + Date.now() - startTime) / 1000);
    const m = Math.floor(t / 60);
    const s = t % 60;
    setDisplay(`${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`);
  };

  useEffect(() => {
    if (!intervalID)
      setIntervalID(setInterval(() => getTime(start), 200));
  }, []);

  useEffect(() => {
    if (!reset) return;
    clearInterval(intervalID);
    setElapsed(0);
    setPaused(false);
    setDisplay('00:00');
    const now = Date.now();
    setStart(now);
    setIntervalID(setInterval(() => getTime(now), 200));
    setReset(false);
  }, [reset]);

  const toggleTimer = () => {
    if (paused) {
      const newStart = Date.now();
      setPaused(false);
      setStart(newStart);
      setIntervalID(setInterval(() => getTime(newStart), 200));
    } else {
      clearInterval(intervalID);
      setPaused(true);
      setElapsed(elapsed + Date.now() - start);
    }
  };

  return (
    <div
      onClick={toggleTimer}
      className="mx-5 mt-3 w-fit border border-black p-2"
    >
      {display}
    </div>
  );
};

export default Timer;
