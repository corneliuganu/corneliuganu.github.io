import { useState, FormEvent, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { useContactSettings, useContactPageContent, useSeoContact } from "@/hooks/use-site-content";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const contact = useContactSettings();
  const content = useContactPageContent();
  const seo = useSeoContact();
  const recipientEmail = contact.recipient_email?.trim() || "yug_data@yahoo.com";
  const emailLink = contact.email_link?.trim() || `mailto:${recipientEmail}`;

  const contactInfo = [
    { icon: Mail, label: contact.email, href: emailLink, subtitle: "Email" },
    { icon: Phone, label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}`, subtitle: "Telefon" },
    { icon: MapPin, label: contact.location, href: undefined, subtitle: "Locație" },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Formularul nu este configurat corect. Lipsesc setările EmailJS.");
      return;
    }

    setSending(true);
    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });
      toast.success("Mesajul a fost trimis cu succes! Te voi contacta în curând.");
      formRef.current.reset();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error("A apărut o eroare la trimiterea mesajului. Te rog încearcă din nou.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        {seo.canonical && <meta property="og:url" content={seo.canonical} />}
        <meta property="og:image" content={seo.ogImage || undefined} />
      </Helmet>

      <div className="pt-16 md:pt-20 min-h-screen">
        {/* Hero Banner */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-gold opacity-[0.03] pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7"
              >
                <span className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4 block">
                  {content.sectionLabel}
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                  {content.title}
                </h1>
                <p className="text-muted-foreground font-body text-base md:text-lg max-w-lg leading-relaxed">
                  {content.subtitle}
                </p>
              </motion.div>

              {/* Contact Cards - Right Side */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-center h-full">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group flex items-center gap-4 p-5 bg-card border border-border rounded-sm hover:border-gold/40 transition-all duration-300"
                      >
                        <div className="w-11 h-11 gradient-gold rounded-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <item.icon size={18} className="text-background" />
                        </div>
                        <div>
                          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-0.5">{item.subtitle}</p>
                          <p className="font-body text-sm text-foreground group-hover:text-gold transition-colors">{item.label}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-5 bg-card border border-border rounded-sm">
                        <div className="w-11 h-11 gradient-gold rounded-sm flex items-center justify-center shrink-0">
                          <item.icon size={18} className="text-background" />
                        </div>
                        <div>
                          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-0.5">{item.subtitle}</p>
                          <p className="font-body text-sm text-foreground">{item.label}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Trimite un <span className="text-gold italic">mesaj</span>
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-8">
              Completează formularul și te voi contacta în cel mai scurt timp
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="to_email" value={recipientEmail} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block">Nume</label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Numele tău"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block">Email</label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors"
                    placeholder="email@exemplu.ro"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block">Tip Eveniment</label>
                  <input
                    type="text"
                    required
                    name="event_type"
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Ce tip de eveniment este?"
                  />
                </div>
                <div>
                  <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block">Data Evenimentului</label>
                  <input
                    type="date"
                    name="event_date"
                    className="w-full bg-transparent border-b-2 border-border px-0 py-3 font-body text-sm text-foreground focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2.5 block">Mesaj</label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  className="w-full bg-transparent border-b-2 border-border px-0 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-gold focus:outline-none transition-colors resize-none"
                  placeholder="Spune-mi mai multe despre evenimentul tău..."
                />
              </div>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-10 py-4 gradient-gold text-background font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? "Se trimite..." : content.ctaText || "Trimite Mesajul"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
