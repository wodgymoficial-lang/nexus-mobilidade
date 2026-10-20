import Link from 'next/link';

export function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} href="/#inicio" aria-label="Relph Nexus Mobilidade — início">
    <svg className="brand-mark" viewBox="0 0 46 52" fill="none" aria-hidden="true"><path d="M3 49V3h5l24 24v10L11 16v33H3Z" fill="currentColor"/><path d="M43 3v46h-6L15 27V17l20 20V3h8Z" fill="#0095a2"/></svg>
    <span className="brand-type"><span className="brand-relph">RELPH</span><span className="brand-nexus">NE<span>X</span>US</span><span className="brand-product">MOBILIDADE</span></span>
  </Link>;
}
