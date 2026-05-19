import { useEffect } from 'react';

function drawClockFavicon() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  const now = new Date();
  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr  = now.getHours() % 12;

  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.strokeStyle = '#2f80a3';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Hour markers
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + Math.cos(angle) * (r - 6);
    const y1 = cy + Math.sin(angle) * (r - 6);
    const x2 = cx + Math.cos(angle) * (r - 10);
    const y2 = cy + Math.sin(angle) * (r - 10);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#2f5260';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Hour hand
  const hourAngle = ((hr + min / 60) / 12) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(hourAngle) * (r * 0.5), cy + Math.sin(hourAngle) * (r * 0.5));
  ctx.strokeStyle = '#14303a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Minute hand
  const minAngle = ((min + sec / 60) / 60) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(minAngle) * (r * 0.7), cy + Math.sin(minAngle) * (r * 0.7));
  ctx.strokeStyle = '#2f80a3';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Second hand
  const secAngle = (sec / 60) * 2 * Math.PI - Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(secAngle) * (r * 0.8), cy + Math.sin(secAngle) * (r * 0.8));
  ctx.strokeStyle = '#e05252';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#14303a';
  ctx.fill();

  return canvas.toDataURL('image/png');
}

export default function useClockFavicon() {
  useEffect(() => {
    // Get or create the favicon link element
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const tick = () => {
      link.href = drawClockFavicon();
    };

    tick(); // draw immediately
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);
}
