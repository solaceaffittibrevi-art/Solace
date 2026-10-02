import Icon from "./Icon";

const iconSize = { sm: 16, md: 20, lg: 24 } as const;

// Icona in contenitore squircle "liquid glass": vetro traslucido, bordo luminoso,
// riflesso in alto e punto luce interno (stili in globals.css, sezione Glass icon).
// Con `children` il contenitore ospita un contenuto diverso da un'icona (es. un numero).
export default function GlassIcon({
  name,
  size = "lg",
  className,
  children,
}: {
  name?: string;
  size?: keyof typeof iconSize;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={["glass-icon", `glass-icon--${size}`, className].filter(Boolean).join(" ")} aria-hidden={children ? undefined : true}>
      {children ?? (name && <Icon name={name} size={iconSize[size]} />)}
    </span>
  );
}
