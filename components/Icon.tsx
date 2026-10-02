// Set di icone lineari del sito: tratto sottile, angoli arrotondati, stessa griglia 24×24.
// Decorative per default (aria-hidden): il significato è sempre affidato al testo vicino.
const paths: Record<string, React.ReactNode> = {
  calm: (
    <>
      <path d="M3 18h18" />
      <path d="M5.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M12 4v3M5.6 6.6l2 2M18.4 6.6l-2 2" />
    </>
  ),
  guest: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.5 11 4.8a1.6 1.6 0 0 1 2 0l7.5 5.7" />
      <path d="M5.5 9v8.5A2.5 2.5 0 0 0 8 20h8a2.5 2.5 0 0 0 2.5-2.5V9" />
      <path d="M10 20v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-4M11 16V8M15 16v-6M19 16V5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
  camera: (
    <>
      <path d="M7 8.5 8.6 6a1.5 1.5 0 0 1 1.3-.7h4.2a1.5 1.5 0 0 1 1.3.7L17 8.5h1.5A2.5 2.5 0 0 1 21 11v6a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17v-6a2.5 2.5 0 0 1 2.5-2.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
      <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z" />
      <path d="M5 18v2M19 18v2" />
    </>
  ),
  doc: (
    <>
      <path d="M8.5 3.5H14l4 4v10.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 18V6a2.5 2.5 0 0 1 2.5-2.5z" />
      <path d="M14 3.5V8h4M9 12h6M9 15.5h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="3.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
      <path d="m9.5 14.5 1.8 1.8 3.4-3.4" />
    </>
  ),
  chat: (
    <>
      <path d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5v-6A2.5 2.5 0 0 1 6.5 5z" />
      <path d="M8 10h8M8 12.8h5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16.5 6.5l2 2M14.5 8.5l1.5 1.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z" />
      <path d="M18.5 15.5c.3 1.8 1 2.5 2.5 2.8-1.5.3-2.2 1-2.5 2.7-.3-1.7-1-2.4-2.5-2.7 1.5-.3 2.2-1 2.5-2.8z" />
    </>
  ),
  wrench: (
    <path d="M14.5 4.2a4.5 4.5 0 0 0 5.3 5.3l-9.6 9.6a2.1 2.1 0 0 1-3-3l9.6-9.6a4.5 4.5 0 0 1-2.3-2.3z" />
  ),
  shield: (
    <>
      <path d="M11.2 3.8a2 2 0 0 1 1.6 0l5 2A1.8 1.8 0 0 1 19 7.5v4c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9v-4a1.8 1.8 0 0 1 1.2-1.7z" />
      <path d="M12 8v4.5l2.5 1.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <path d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.8c1.6.6 2.7 2 3 4.2" />
    </>
  ),
  arrow: <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />,
  external: <path d="M8 16 17 7M9.5 7H17v7.5" />,
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3.5" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 8h16M4 16h16" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16v.5" />
    </>
  ),
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 15.9l-4.9 2.7 1.1-5.3-4-3.7 5.4-.6z" />,
  chevronLeft: <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  chevronRight: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  expand: <path d="M4.5 9.5v-5h5M19.5 9.5v-5h-5M4.5 14.5v5h5M19.5 14.5v5h-5" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18V7M3 14h18v4M21 14v-2.5a3 3 0 0 0-3-3h-7V14" />
      <circle cx="7" cy="11" r="1.8" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.2-3.8A8.5 8.5 0 1 1 8 19z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.8-2-1-1 1c-1.3-.5-2.2-1.4-2.7-2.7l1-1-1-2z" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.8 7.2v.1" />
    </>
  ),
};

export default function Icon({
  name,
  size = 24,
  className,
  title,
}: {
  name: string;
  size?: number;
  className?: string;
  title?: string;
}) {
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
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name] ?? null}
    </svg>
  );
}
