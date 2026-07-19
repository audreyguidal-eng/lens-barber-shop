import type { SVGProps } from "react";

const paths: Record<string, JSX.Element> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </>
  ),
  razor: (
    <>
      <path d="M14 4 20 10 10 20H4v-6L14 4Z" />
      <path d="M14 4 20 10" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 8v6M8 11h8M9 20l3-6 3 6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-3.9-4-7.4-9-7.4Z" />
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </>
  ),
  droplet: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  flower: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2a3 3 0 0 1 3 3c0 1.5-1.5 3-3 4.5C10.5 8 9 6.5 9 5a3 3 0 0 1 3-3ZM12 22a3 3 0 0 0 3-3c0-1.5-1.5-3-3-4.5-1.5 1.5-3 3-3 4.5a3 3 0 0 0 3 3ZM2 12a3 3 0 0 1 3-3c1.5 0 3 1.5 4.5 3-1.5 1.5-3 3-4.5 3a3 3 0 0 1-3-3ZM22 12a3 3 0 0 0-3-3c-1.5 0-3 1.5-4.5 3 1.5 1.5 3 3 4.5 3a3 3 0 0 0 3-3Z" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 16V8h3a2.5 2.5 0 0 1 0 5H9" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  wheelchair: (
    <>
      <circle cx="12" cy="4" r="1.6" />
      <path d="M11 7v5h4l3 5M11 12a5 5 0 1 0 4 8" />
    </>
  ),
  afro: (
    <>
      <path d="M12 4a5 5 0 0 0-5 5c0 .7.1 1.3.4 1.9A3 3 0 0 0 8 16h8a3 3 0 0 0 .6-5.1c.3-.6.4-1.2.4-1.9a5 5 0 0 0-5-5Z" />
      <path d="M9 16v3a3 3 0 0 0 6 0v-3" />
    </>
  ),
  woman: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M8.5 9.5 7 20M15.5 9.5 17 20M9 15h6" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </>
  ),
  phone: (
    <path d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.3 1.1L7.3 10.5a12 12 0 0 0 5.2 5.2l1.6-1.5c.3-.3.7-.4 1.1-.3l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1A15 15 0 0 1 4 5Z" />
  ),
  pin: (
    <>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
};

export function Icon({
  name,
  size = 24,
  ...props
}: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name] ?? paths.scissors}
    </svg>
  );
}
