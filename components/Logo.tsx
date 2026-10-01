export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "logo logo--small" : "logo"}>
      <span className="logo__name">Solace</span>
      <span className="logo__tag">Real Estate Short Rent</span>
    </span>
  );
}
