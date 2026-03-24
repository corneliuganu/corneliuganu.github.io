import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const seo = useSeoPortfolio();

  const selectCategory = useCallback(
    (cat: string) => {
      setActive(cat);
      const search =
        cat === "Toate" ? "" : `?categorie=${encodeURIComponent(cat)}`;
      // URL-ul e sursa de adevăr: la Botez vezi doar Botez, refresh/partajare păstrează filtrul.
      navigate(
        { pathname: location.pathname, search },
        {
          replace: true,
          state: cat === "Toate" ? {} : { fromCategory: cat },
        }
      );
    },
    [location.pathname, navigate]
  );

  // Reset gallery when navigating to /portofoliu (e.g. clicking nav link)
  useEffect(() => {
    setOpenEvent(null);
    setLightboxIdx(null);
  }, [location.key]);

  // Categoria activă: mai întâi ?categorie= din URL (nu poate fi „uzurpată” de state vechi), apoi state.
  useEffect(() => {
    const fromState =
      (location.state as { fromCategory?: string } | null)?.fromCategory ?? null;
    const fromUrl = new URLSearchParams(location.search).get("categorie");
    const allowed = new Set(["Toate", ...categories]);
    if (fromUrl && allowed.has(fromUrl)) {
      setActive(fromUrl);
      return;
    }
    if (fromState && allowed.has(fromState)) {
      setActive(fromState);
      return;
    }
    setActive("Toate");
  }, [location.pathname, location.search, location.state, categories]);

  const filtered =
    active === "Toate"
      ? [...entries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
                  onClick={() => selectCategory(cat)}
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

            {/* Events Grid — fără AnimatePresence: animațiile de exit lăsau plăci „Nuntă” vizibile peste filtrele înguste */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((event) => (
                  <Link
                    key={event.slug}
                    to={{
                      pathname: `/portofoliu/${event.slug}`,
                      search:
                        active !== "Toate"
                          ? `?categorie=${encodeURIComponent(active)}`
                          : "",
                    }}
                    state={{
                      fromCategory: active !== "Toate" ? active : undefined,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                        <div className="text-left">
                          <span className="font-body text-sm tracking-widest uppercase text-gold mb-0.5 block">
                            {event.category}
                          </span>
                          <p className="font-display text-xl font-semibold text-white leading-tight">
                            {event.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      
    </>
  );
};

export default Portfolio;
