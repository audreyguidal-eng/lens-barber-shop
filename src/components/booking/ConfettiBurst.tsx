"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#C9A25A", "#1F6B54", "#12233B", "#DDBE86"];

export function ConfettiBurst() {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = useState<
    { x: number; delay: number; rot: number; color: string; left: number }[]
  >([]);

  useEffect(() => {
    if (reduce) return;
    setPieces(
      Array.from({ length: 40 }).map(() => ({
        x: (Math.random() - 0.5) * 120,
        delay: Math.random() * 0.4,
        rot: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        left: Math.random() * 100,
      })),
    );
  }, [reduce]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 1, rotate: p.rot }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rot + 360 }}
          transition={{ duration: 2.6 + Math.random() * 1.2, delay: p.delay, ease: "easeIn" }}
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: 8,
            height: 12,
            position: "absolute",
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
