import { useEffect } from "react";
import { Link } from "react-router-dom";

// Meniul mobil, identic cu cel de pe aurelianepuras.github.io; stilul e în src/mobile-menu.css.

type NavLink = { to: string; label: string };
type ExtLink = { href: string; label: string };

const num = (i: number) => String(i + 1).padStart(2, "0");

export const ThemeSwitch = ({ onToggle }: { onToggle: () => void }) => (
  <button type="button" className="mtheme" aria-label="Schimbă tema" onClick={onToggle}>
    <span className="sw">
      <span className="sw-knob" />
      <svg className="sw-sun" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      <svg className="sw-moon" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    </span>
  </button>
);

export const Burger = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
  <button
    type="button"
    className="burger"
    aria-label={open ? "Închide meniul" : "Deschide meniul"}
    aria-expanded={open}
    aria-controls="mobile-menu"
    onClick={onToggle}
  >
    <span><i /><i /></span>
  </button>
);

export const MobileMenu = ({
  open,
  onClose,
  links,
  isActive,
  extra = [],
  socials = [],
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isActive: (to: string) => boolean;
  extra?: ExtLink[];
  socials?: ExtLink[];
}) => {
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => () => document.documentElement.classList.remove("menu-open"), []);

  return (
    <div id="mobile-menu" className="mmenu" aria-hidden={!open}>
      <nav className="mnav" aria-label="Meniu mobil">
        {links.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={isActive(link.to) ? "on" : ""}
            aria-current={isActive(link.to) ? "page" : undefined}
            style={{ "--dl": `${0.18 + i * 0.05}s` } as React.CSSProperties}
          >
            <small>{num(i)}</small><b>{link.label}</b>
          </Link>
        ))}
      </nav>
      {(extra.length > 0 || socials.length > 0) && (
        <div className="mfoot">
          <div className="mlinks">
            {extra.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label} <span aria-hidden="true">↗︎</span></a>
            ))}
            {extra.length > 0 && socials.length > 0 && <span className="mbreak" aria-hidden="true" />}
            {socials.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
