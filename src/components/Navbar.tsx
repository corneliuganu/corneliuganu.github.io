import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { MobileMenu, Burger, ThemeSwitch } from "./MobileMenu";
import { useSocialSettings } from "@/hooks/use-site-content";

const navLinks = [
  { to: "/", label: "Acasă" },
  { to: "/portofoliu", label: "Portofoliu" },
  { to: "/despre", label: "Despre" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const social = useSocialSettings();
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-[78px] md:h-20">
          <Link to="/" className="font-display text-[1.375rem] md:text-2xl font-bold tracking-wider text-foreground">
            Cornel <span className="text-gold">Iuganu</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.to
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm text-muted-foreground hover:text-gold transition-colors"
              aria-label="Schimbă tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeSwitch onToggle={toggleTheme} />
            <Burger open={isOpen} onToggle={() => setIsOpen((o) => !o)} />
          </div>
        </div>
      </div>
    </nav>

    <MobileMenu
      open={isOpen}
      onClose={closeMenu}
      links={navLinks}
      isActive={(to) => location.pathname === to}
      socials={[
        { href: social.facebook, label: "Facebook" },
        { href: social.instagram, label: "Instagram" },
        { href: social.youtube, label: "YouTube" },
      ].filter((l) => l.href && !/^https?:\/\/(www\.)?(instagram|facebook|youtube)\.com\/?$/.test(l.href) && !(l.label === "YouTube" && l.href.includes("facebook.com")))}
    />
    </>
  );
};

export default Navbar;
