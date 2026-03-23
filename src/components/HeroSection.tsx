import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, Camera } from "lucide-react";
import { useHomeContent } from "@/hooks/use-site-content";

const HeroSection = () => {
  const home = useHomeContent();
  const [firstPart, lastPart] = (() => {
    const title = (home.heroTitle || "").trim();
    if (!title) return ["", ""];
    const parts = title.split(/\s+/);
    if (parts.length < 2) return [title, ""];
    return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
  })();

  return (
    <section className="relative min-h-screen flex items-end md:items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={home.heroImage}
          alt="Fotografie eveniment de Cornel Iuganu"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 dark:from-background dark:via-background/40 dark:to-background/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-24 md:pb-0 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <Camera size={16} className="text-gold" />
            <span className="font-body text-xs tracking-[0.3em] uppercase text-gold">
              {home.heroBadge}
            </span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white">
            {firstPart}
            {lastPart ? (
              <>
                {" "}
                <span className="text-gold">{lastPart}</span>
              </>
            ) : null}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
          >
            {home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/portofoliu"
              className="inline-flex items-center justify-center px-8 py-3.5 gradient-gold text-background font-body text-sm tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
            >
              {home.heroCtaPrimary}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/70 text-white font-body text-sm tracking-widest uppercase rounded-sm hover:border-gold hover:text-gold transition-colors"
            >
              {home.heroCtaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={20} className="text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
