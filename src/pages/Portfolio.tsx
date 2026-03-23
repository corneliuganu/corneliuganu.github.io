import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";
import { usePortfolioPageContent, usePortfolioFilters, useSeoPortfolio } from "@/hooks/use-site-content";
import { usePortfolio, PortfolioEntry } from "@/hooks/use-portfolio";

const Portfolio = () => {
  const page = usePortfolioPageContent();
  const { categories } = usePortfolioFilters();
  const { entries } = usePortfolio();
  const [active, setActive] = useState("Toate");
  const [openEvent, setOpenEvent] = useState<PortfolioEntry | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const location = useLocation();
  const seo = useSeoPortfolio();

  // Reset gallery when navigating to /portofoliu (e.g. clicking nav link)
  useEffect(() => {
    setOpenEvent(null);
    setLightboxIdx(null);
  }, [location.key]);

  const filtered =
    active === "Toate"
      ? categories.flatMap((cat) =>
          [...entries]
            .filter((e) => e.category === cat)
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, cat === "Nuntă" ? 3 : 2)
        )
      : entries
          .filter((e) => e.category === active)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

  const lightboxPhotos = openEvent?.photos ?? [];

  const goTo = useCallback((dir: number) => {
    if (lightboxIdx === null) return;
    const next = (lightboxIdx + dir + lightboxPhotos.length) % lightboxPhotos.length;
    setLightboxIdx(next);
  }, [lightboxIdx, lightboxPhotos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx !== null) {
        if (e.key === "ArrowLeft") goTo(-1);
        if (e.key === "ArrowRight") goTo(1);
        if (e.key === "Escape") setLightboxIdx(null);
      } else if (openEvent && e.key === "Escape") {
        setOpenEvent(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, openEvent, goTo]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

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
        <meta property="og:image" content={seo.ogImage || (filtered[0]?.image ?? "")} />
      </Helmet>

        <div className="pt-20 md:pt-24 min-h-screen">
          <div className="container mx-auto px-4 py-12 md:py-16 pb-24 md:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                {page.title}
              </h1>
              <p className="text-muted-foreground font-body max-w-md mx-auto">
                {page.subtitle}
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {["Toate", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-sm text-xs tracking-widest uppercase font-body transition-all duration-300 ${
                    active === cat
                      ? "gradient-gold text-background"
                      : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Events Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((event) => (
                  <Link key={event.slug} to={`/portofoliu/${event.slug}`}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent flex items-end p-6">
                        <div>
                          <span className="font-body text-sm tracking-widest uppercase text-gold mb-0.5 block">
                            {event.category}
                          </span>
                          <p className="font-display text-xl font-semibold text-foreground leading-tight">
                            {event.title}
                          </p>
                          {event.photos.length > 0 && (
                            <p className="font-body text-sm text-muted-foreground mt-1">
                              {event.photos.length} fotografii
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      
    </>
  );
};

export default Portfolio;
