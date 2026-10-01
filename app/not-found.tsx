import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <p className="eyebrow">Pagina non trovata</p>
        <h1 className="page-hero__title">
          Questa porta <em>non si apre.</em>
        </h1>
        <p className="lead">La pagina che cercavi non esiste o è stata spostata.</p>
        <div className="not-found__actions">
          <Link href="/" className="btn">
            Torna alla home
          </Link>
          <Link href="/immobili" className="btn btn--ghost">
            Guarda gli immobili
          </Link>
        </div>
      </div>
    </section>
  );
}
