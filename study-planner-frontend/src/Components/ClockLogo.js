import React, { useEffect, useRef } from 'react';
import './ClockLogo.css';

function AnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDegrees = ((seconds / 60) * 360) + 90;
      const minuteDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
      const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDegrees}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDegrees}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDegrees}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      <div className="clock-face">
        <div ref={hourRef} className="hand hour-hand"></div>
        <div ref={minuteRef} className="hand minute-hand"></div>
        <div ref={secondRef} className="hand second-hand"></div>
        <div className="number number1">1</div>
        <div className="number number2">2</div>
        <div className="number number3">3</div>
        <div className="number number4">4</div>
        <div className="number number5">5</div>
        <div className="number number6">6</div>
        <div className="number number7">7</div>
        <div className="number number8">8</div>
        <div className="number number9">9</div>
        <div className="number number10">10</div>
        <div className="number number11">11</div>
        <div className="number number12">12</div>
      </div>
    </div>
  );
}

export default AnalogClock;