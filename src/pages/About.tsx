import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useAboutContent, useSeoAbout } from "@/hooks/use-site-content";

const About = () => {
  const about = useAboutContent();
  const seo = useSeoAbout();

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage || about.image} />
      </Helmet>

      <div className="pt-16 md:pt-20 min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-4 pb-16 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
                <img
                  src={about.image}
                  alt="Cornel Iuganu - Fotograf profesionist"
                  className="w-full aspect-[3/4] object-cover rounded-sm"
                  loading="lazy"
                />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4 block">
                {about.sectionLabel}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {about.title}
              </h1>
              <div className="space-y-4 text-muted-foreground font-body text-sm leading-relaxed whitespace-pre-line">
                {about.body}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
