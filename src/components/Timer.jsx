import { useState, useEffect } from "react";

const Timer = ({ menuProps }) => {
  const { resetTimer: reset, setResetTimer: setReset } = menuProps;
  const timerState = JSON.parse(localStorage.getItem("timer"));
  const [start, setStart] = useState(Date.now());
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(timerState ? timerState.elapsed : 0);
  const [intervalID, setIntervalID] = useState(() =>
    setInterval(() => getTime(start, elapsed), 200)
  );
  const [display, setDisplay] = useState(
    timerState ? timerState.display : "00:00"
  );

  const getTime = (startTime, prevTime) => {
    const t = Math.floor((prevTime + Date.now() - startTime) / 1000);
    const m = Math.floor(t / 60);
    const s = t % 60;
    setDisplay(`${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`);
  };

  useEffect(() => {
    localStorage.setItem(
      "timer",
      JSON.stringify({
        display,
        elapsed: paused ? elapsed : elapsed + Date.now() - start,
      })
    );
  }, [display, elapsed]);

  useEffect(() => {
    if (!reset) return;
    clearInterval(intervalID);
    setElapsed(0);
    setPaused(false);
    setDisplay("00:00");
    const now = Date.now();
    setStart(now);
    setIntervalID(setInterval(() => getTime(now, 0), 200));
    setReset(false);
  }, [reset]);

  const toggleTimer = () => {
    if (paused) {
      const newStart = Date.now();
      setPaused(false);
      setStart(newStart);
      setIntervalID(setInterval(() => getTime(newStart, elapsed), 200));
    } else {
      clearInterval(intervalID);
      setPaused(true);
      setElapsed(elapsed + Date.now() - start);
    }
  };

  // old styles: mt-3 w-fit bg-blue-200 px-5 py-3 leading-[27px]
  return (
    <div onClick={toggleTimer} className="">
      {display}
    </div>
  );
};

export default Timer;
