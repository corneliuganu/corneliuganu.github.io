import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useHomeContent, useSeoHome } from "@/hooks/use-site-content";
import portfolioWedding1 from "@/assets/portfolio-wedding-1.jpg";

const Index = () => {
  const { latestByCategory } = usePortfolio();
  const home = useHomeContent();
  const seo = useSeoHome();

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:image" content={seo.ogImage || portfolioWedding1} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": seo.schemaName,
            "description": seo.schemaDescription,
            "address": { "@type": "PostalAddress", "addressLocality": seo.schemaCity, "addressCountry": "RO" },
            "image": portfolioWedding1,
          })}
        </script>
      </Helmet>

      <HeroSection />

      {/* Stats */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto text-center">
            {home.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <p className="font-display text-3xl md:text-5xl font-bold text-gold">{stat.number}</p>
                <p className="font-body text-xs md:text-sm text-muted-foreground mt-2 tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {home.featuredTitle || (
                <>
                  Lucrări <span className="text-gold italic">Recente</span>
                </>
              )}
            </h2>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              {home.featuredSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {latestByCategory.map((work, i) => (
              <Link
                key={work.slug}
                to={`/portofoliu?categorie=${encodeURIComponent(work.category)}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="group relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                    <span className="font-body text-base tracking-widest uppercase text-white dark:text-gold">
                      {{"Nunți": "Nuntă", "Botezuri": "Botez", "Corporate": "Portret", "Festivaluri": "Peisaj"}[work.category] || work.category}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/portofoliu"
              className="inline-flex items-center px-8 py-3.5 border border-border text-foreground font-body text-sm tracking-widest uppercase rounded-sm hover:border-gold hover:text-gold transition-colors"
            >
              {home.featuredCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
