import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";

const PortfolioEntryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { entries } = usePortfolio();

  const entry = useMemo(
    () => entries.find((e) => e.slug === slug),
    [entries, slug]
  );

  if (!entry) {
    return (
      <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-sm text-muted-foreground mb-4">
            Galeria nu a fost găsită.
          </p>
          <Link
            to="/portofoliu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-gold text-gold hover:bg-gold hover:text-background transition-all font-body text-sm font-medium tracking-wider"
          >
            <ArrowLeft size={18} />
            Înapoi la Portofoliu
          </Link>
        </div>
      </div>
    );
  }

  const photos = entry.photos.length
    ? entry.photos
    : [{ src: entry.image, alt: entry.title }];
  const entryCanonical = `https://corneliuganu.github.io/portofoliu/${entry.slug}`;
  const fromCategory = new URLSearchParams(location.search).get("categorie");
  const backTo = fromCategory
    ? `/portofoliu?categorie=${encodeURIComponent(fromCategory)}`
    : "/portofoliu";

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) =>
          prev === null ? prev : (prev - 1 + photos.length) % photos.length
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) =>
          prev === null ? prev : (prev + 1) % photos.length
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, photos.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIdx !== null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  return (
    <>
      <Helmet>
        <title>{`${entry.title} — ${entry.category} | Cornel Iuganu Photography`}</title>
        <meta
          name="description"
          content={entry.description || `Galerie foto ${entry.title} — ${entry.category}.`}
        />
        <link rel="canonical" href={entryCanonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={entry.title} />
        <meta
          property="og:description"
          content={entry.description || `Galerie foto ${entry.title} — ${entry.category}.`}
        />
        <meta property="og:url" content={entryCanonical} />
        <meta property="og:image" content={entry.image} />
      </Helmet>

      <div className="pt-20 md:pt-24 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12 pb-24 md:pb-32">
          <div className="mb-8">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-gold text-gold hover:bg-gold hover:text-background transition-all font-body text-sm font-medium tracking-wider mb-6"
            >
              <ArrowLeft size={18} />
              Înapoi la Portofoliu
            </Link>
            <div className="text-center">
              <span className="font-body text-xs tracking-widest uppercase text-gold">
                {entry.category}
              </span>
              <h1 className="font-display text-2xl md:text-4xl font-bold mt-1">
                {entry.title}
              </h1>
              {entry.description && (
                <p className="text-muted-foreground font-body text-sm mt-3 max-w-lg mx-auto">
                  {entry.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.src + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-zoom-in"
                  onClick={() => setLightboxIdx(i)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && photos[lightboxIdx] ? (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxIdx(null)}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="relative w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Închide"
                  className="fixed right-8 top-7 text-white/80 hover:text-white transition-colors"
                  onClick={() => setLightboxIdx(null)}
                >
                  <X size={22} />
                </button>

                <div className="relative mx-auto w-fit max-w-full">
                  <img
                    src={photos[lightboxIdx].src}
                    alt={photos[lightboxIdx].alt}
                    className="max-h-[75vh] w-auto max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-4rem)] object-contain"
                  />

                  {photos.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className="fixed left-10 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/30 text-white/90 hover:text-white hover:bg-black/45 transition-all border border-white/15"
                        onClick={() =>
                          setLightboxIdx(
                            (prev) =>
                              prev === null
                                ? prev
                                : (prev - 1 + photos.length) % photos.length
                          )
                        }
                        aria-label="Imagine anterioară"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        className="fixed right-10 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/30 text-white/90 hover:text-white hover:bg-black/45 transition-all border border-white/15"
                        onClick={() =>
                          setLightboxIdx((prev) =>
                            prev === null ? prev : (prev + 1) % photos.length
                          )
                        }
                        aria-label="Imagine următoare"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  ) : null}

                  <div className="pointer-events-none absolute inset-x-0 bottom-6">
                    <div className="mx-auto w-fit max-w-full text-center">
                      <div className="drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
                        <div className="font-display text-white text-lg md:text-xl leading-tight">
                          {entry.title}
                        </div>
                        {photos[lightboxIdx].alt ? (
                          <div className="font-body text-xs md:text-sm text-white/80 mt-1">
                            {photos[lightboxIdx].alt}
                          </div>
                        ) : null}
                        <div className="font-body text-sm md:text-base mt-2 text-gold font-semibold">
                          {lightboxIdx + 1}/{photos.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default PortfolioEntryPage;

