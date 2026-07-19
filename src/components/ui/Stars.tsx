"use client";

import { motion } from "framer-motion";

export function Stars({
  value = 5,
  size = 18,
  animate = false,
}: {
  value?: number;
  size?: number;
  animate?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        const Star = (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={filled ? "text-gold" : "text-gold/30"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 4.94 5.36.46c.5.04.7.66.32.99l-4.06 3.5 1.2 5.24a.56.56 0 0 1-.84.6L12 16.9l-4.63 2.83a.56.56 0 0 1-.84-.6l1.2-5.24-4.06-3.5a.56.56 0 0 1 .32-.99l5.36-.46 2.13-4.94Z"
            />
          </svg>
        );
        if (!animate) return <span key={i}>{Star}</span>;
        return (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 16 }}
          >
            {Star}
          </motion.span>
        );
      })}
    </div>
  );
}
