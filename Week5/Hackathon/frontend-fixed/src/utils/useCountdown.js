'use client';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function useCountdown(endTime) {
  const [left, setLeft] = useState(getLeft(endTime));
  useEffect(()=>{ const id = setInterval(()=>setLeft(getLeft(endTime)), 1000); return ()=>clearInterval(id); }, [endTime]);
  return left;
}

function getLeft(end) {
  if (!end) return { text: '—', isEnded: false };
  const diff = dayjs(end).diff(dayjs(), 'second');
  if (diff <= 0) return { text: 'Ended', isEnded: true };
  const d = Math.floor(diff/(3600*24));
  const h = Math.floor((diff%(3600*24))/3600);
  const m = Math.floor((diff%3600)/60);
  const s = diff%60;
  return { text: `${d}d ${h}h ${m}m ${s}s`, isEnded: false };
}
