import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useContactSettings, useFooterContent, useSocialSettings } from "@/hooks/use-site-content";

const Footer = () => {
  const contact = useContactSettings();
  const social = useSocialSettings();
  const footer = useFooterContent();
  const recipientEmail = "yug_data@yahoo.com";

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              {footer.brandTitle}
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              {footer.brandSubtitle}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Navigare</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Acasă" },
                { to: "/portofoliu", label: "Portofoliu" },
                { to: "/despre", label: "Despre" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-gold transition-colors text-sm font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-foreground">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground font-body">
              <a href={`mailto:${recipientEmail}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail size={16} />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone size={16} />
                {contact.phone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {contact.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-body">
            {footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors" aria-label="YouTube">
              <Youtube size={20} />
            </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
