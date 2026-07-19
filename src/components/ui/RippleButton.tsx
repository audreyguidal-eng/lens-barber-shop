"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "gold" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Bouton avec micro-interaction "ripple". Rend un <Link> si href fourni. */
export function RippleButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const spawn = (e: MouseEvent) => {
    const host = ref.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    host.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };

  const cls = cn(
    variant === "primary" && "btn-primary",
    variant === "gold" && "btn-gold",
    variant === "ghost" && "btn-ghost",
    disabled && "pointer-events-none opacity-60",
    className,
  );

  const inner = (
    <span ref={ref} className="absolute inset-0 overflow-hidden rounded-full" aria-hidden />
  );

  if (href) {
    return (
      <Link href={href} className={cls} onClick={spawn}>
        {inner}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cls}
      onClick={(e) => {
        spawn(e);
        onClick?.();
      }}
    >
      {inner}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
