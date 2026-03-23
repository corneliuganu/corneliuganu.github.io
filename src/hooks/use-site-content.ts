import { useMemo } from "react";

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, unknown> = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === "true") {
      data[key] = true;
      return;
    }
    if (value === "false") {
      data[key] = false;
      return;
    }
    const num = Number(value);
    data[key] = Number.isNaN(num) ? value : num;
  });
  return data;
}

const imageModules = import.meta.glob("/src/assets/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(imagePath: string | undefined): string | undefined {
  if (!imagePath) return undefined;
  const filename = imagePath.split("/").pop();
  const match = Object.entries(imageModules).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return match ? match[1] : imagePath;
}

// Home content

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  stats: { number: string; label: string }[];
  heroBadge?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredCta?: string;
}

export function useHomeContent(): HomeContent {
  const files = import.meta.glob("/content/pages/home.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return useMemo(() => {
    const raw = files["/content/pages/home.md"] as string | undefined;
    if (!raw) {
      return {
        heroTitle: "Cornel Iuganu",
        heroSubtitle:
          "Captez emoțiile autentice ale momentelor tale speciale. Nunți, botezuri, evenimente corporate — fiecare fotografie spune o poveste.",
        stats: [
          { number: "500+", label: "Evenimente" },
          { number: "12", label: "Ani Experiență" },
          { number: "50k+", label: "Fotografii" },
        ],
      };
    }
    const data = parseFrontmatter(raw);
    const heroImage = resolveImage(data.hero_image as string | undefined);
    const stats = [
      { number: String(data.stat1_number ?? ""), label: String(data.stat1_label ?? "") },
      { number: String(data.stat2_number ?? ""), label: String(data.stat2_label ?? "") },
      { number: String(data.stat3_number ?? ""), label: String(data.stat3_label ?? "") },
    ].filter((s) => s.number && s.label);

    return {
      heroTitle: (data.hero_title as string) || "Cornel Iuganu",
      heroSubtitle:
        (data.hero_subtitle as string) ||
        "Captez emoțiile autentice ale momentelor tale speciale. Nunți, botezuri, evenimente corporate — fiecare fotografie spune o poveste.",
      heroImage,
      stats: stats.length
        ? stats
        : [
            { number: "500+", label: "Evenimente" },
            { number: "12", label: "Ani Experiență" },
            { number: "50k+", label: "Fotografii" },
          ],
      heroBadge: (data.hero_badge as string) || "Fotograf de Evenimente",
      heroCtaPrimary: (data.hero_cta_primary as string) || "Vezi Portofoliul",
      heroCtaSecondary: (data.hero_cta_secondary as string) || "Contactează-mă",
      featuredTitle: (data.featured_title as string) || "Lucrări Recente",
      featuredSubtitle:
        (data.featured_subtitle as string) ||
        "O selecție din cele mai recente proiecte fotografice",
      featuredCta: (data.featured_cta as string) || "Vezi Tot Portofoliul",
    };
  }, [files]);
}

// SEO

export interface SeoHome {
  title: string;
  description: string;
  schemaName: string;
  schemaDescription: string;
  schemaCity: string;
  canonical?: string;
  ogImage?: string;
}

export function useSeoHome(): SeoHome {
  const files = import.meta.glob("/content/seo/home.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const raw =
      (files["/content/seo/home.json"] as {
        title?: string;
        description?: string;
        schema_name?: string;
        schema_description?: string;
        schema_city?: string;
        canonical?: string;
        og_image?: string;
      }) || {};

    return {
      title:
        raw.title ||
        "Cornel Iuganu — Fotograf Profesionist de Evenimente",
      description:
        raw.description ||
        "Cornel Iuganu — fotograf profesionist de evenimente din București. Nunți, botezuri, evenimente corporate. Captez momentele care contează.",
      schemaName: raw.schema_name || "Cornel Iuganu Photography",
      schemaDescription:
        raw.schema_description || "Fotograf profesionist de evenimente",
      schemaCity: raw.schema_city || "București",
      canonical: raw.canonical || "https://corneliuganu.github.io",
      ogImage: raw.og_image,
    };
  }, [files]);
}

export interface SeoSimple {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export function useSeoPortfolio(): SeoSimple {
  const files = import.meta.glob("/content/seo/portfolio.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const raw =
      (files["/content/seo/portfolio.json"] as {
        title?: string;
        description?: string;
        og_image?: string;
        canonical?: string;
      }) || {};
    return {
      title: raw.title || "Portofoliu — Cornel Iuganu Photography",
      description:
        raw.description ||
        "Explorează portofoliul meu de fotografie de evenimente: nunți, botezuri, portrete și peisaje.",
      ogImage: raw.og_image,
      canonical: raw.canonical || "https://corneliuganu.github.io/portofoliu",
    };
  }, [files]);
}

export function useSeoAbout(): SeoSimple {
  const files = import.meta.glob("/content/seo/about.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const raw =
      (files["/content/seo/about.json"] as {
        title?: string;
        description?: string;
        og_image?: string;
        canonical?: string;
      }) || {};
    return {
      title: raw.title || "Despre — Cornel Iuganu Photography",
      description:
        raw.description ||
        "Află povestea din spatele obiectivului. Cornel Iuganu — fotograf profesionist cu peste 12 ani de experiență.",
      ogImage: raw.og_image,
      canonical: raw.canonical || "https://corneliuganu.github.io/despre",
    };
  }, [files]);
}

export function useSeoContact(): SeoSimple {
  const files = import.meta.glob("/content/seo/contact.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const raw =
      (files["/content/seo/contact.json"] as {
        title?: string;
        description?: string;
        og_image?: string;
        canonical?: string;
      }) || {};
    return {
      title: raw.title || "Contact — Cornel Iuganu Photography",
      description:
        raw.description ||
        "Contactează-mă pentru evenimentul tău. Cornel Iuganu — fotograf profesionist de evenimente.",
      ogImage: raw.og_image,
      canonical: raw.canonical || "https://corneliuganu.github.io/contact",
    };
  }, [files]);
}

// About page

export interface AboutContent {
  sectionLabel?: string;
  title: string;
  image?: string;
  body: string;
}

export function useAboutContent(): AboutContent {
  const files = import.meta.glob("/content/pages/about.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return useMemo(() => {
    const raw = files["/content/pages/about.md"] as string | undefined;
    if (!raw) {
      return {
        title: "Povestea din spatele obiectivului",
        body:
          "Sunt Cornel Iuganu, fotograf profesionist de evenimente din București. De peste 12 ani captez momente unice la nunți, botezuri, festivaluri și evenimente corporate.",
      };
    }

    const data = parseFrontmatter(raw);
    const image = resolveImage(data.image as string | undefined);

    let body = (data.body as string) || "";
    if (!body) {
      const matchBody = raw.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
      body = matchBody?.[1]?.trim() ?? "";
    }

    return {
      sectionLabel: (data.section_label as string) || "Despre Mine",
      title: (data.title as string) || "Povestea din spatele obiectivului",
      image,
      body,
    };
  }, [files]);
}

// Contact & social settings

export interface ContactSettings {
  email: string;
  recipient_email?: string;
  email_link?: string;
  phone: string;
  location: string;
}

export interface SocialSettings {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export function useContactSettings(): ContactSettings {
  const files = import.meta.glob("/content/settings/contact.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const data = (files["/content/settings/contact.json"] as ContactSettings | undefined) ?? {
      email: "contact@corneliuganu.ro",
      recipient_email: "yug_data@yahoo.com",
      email_link: "mailto:yug_data@yahoo.com",
      phone: "+40 712 345 678",
      location: "București, România",
    };
    return data;
  }, [files]);
}

export function useSocialSettings(): SocialSettings {
  const files = import.meta.glob("/content/settings/social.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const data = (files["/content/settings/social.json"] as SocialSettings | undefined) ?? {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
    };
    return data;
  }, [files]);
}

// Contact page content

export interface ContactPageContent {
  sectionLabel?: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export function useContactPageContent(): ContactPageContent {
  const files = import.meta.glob("/content/pages/contact.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return useMemo(() => {
    const raw = files["/content/pages/contact.md"] as string | undefined;
    if (!raw) {
      return {
        title: "Hai să creăm amintiri împreună",
        subtitle:
          "Fiecare eveniment merită să fie povestit prin imagini excepționale. Spune-mi despre momentul tău special.",
        ctaText: "Trimite Mesajul",
      };
    }
    const data = parseFrontmatter(raw);
    return {
      sectionLabel: (data.section_label as string) || "Contact",
      title:
        (data.title as string) ||
        "Hai să creăm amintiri împreună",
      subtitle:
        (data.subtitle as string) ||
        "Fiecare eveniment merită să fie povestit prin imagini excepționale. Spune-mi despre momentul tău special.",
      ctaText: (data.cta_text as string) || "Trimite Mesajul",
    };
  }, [files]);
}

// Portfolio page content & filters

export interface PortfolioPageContent {
  title: string;
  subtitle: string;
}

export function usePortfolioPageContent(): PortfolioPageContent {
  const files = import.meta.glob("/content/pages/portfolio.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  return useMemo(() => {
    const raw = files["/content/pages/portfolio.md"] as string | undefined;
    if (!raw) {
      return {
        title: "Portofoliu",
        subtitle: "O colecție de momente captate cu pasiune și profesionalism",
      };
    }
    const data = parseFrontmatter(raw);
    return {
      title: (data.title as string) || "Portofoliu",
      subtitle:
        (data.subtitle as string) ||
        "O colecție de momente captate cu pasiune și profesionalism",
    };
  }, [files]);
}

export interface PortfolioFiltersConfig {
  categories: string[];
}

export function usePortfolioFilters(): PortfolioFiltersConfig {
  const files = import.meta.glob("/content/settings/portfolio-filters.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const data =
      (files["/content/settings/portfolio-filters.json"] as PortfolioFiltersConfig | undefined) ?? {
        categories: ["Nuntă", "Botez", "Portret", "Peisaj"],
      };
    return data;
  }, [files]);
}

// Footer

export interface FooterContent {
  brandTitle: string;
  brandSubtitle: string;
  copyright: string;
}

export function useFooterContent(): FooterContent {
  const files = import.meta.glob("/content/settings/footer.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const raw = files["/content/settings/footer.json"] as
      | { brand_title?: string; brand_subtitle?: string; copyright?: string }
      | undefined;

    return {
      brandTitle: raw?.brand_title ?? "Cornel Iuganu",
      brandSubtitle:
        raw?.brand_subtitle ??
        "Fotograf profesionist de evenimente. Captez momentele care contează, cu pasiune și atenție la detalii.",
      copyright:
        raw?.copyright ??
        "© 2026 Cornel Iuganu Photography. Toate drepturile rezervate.",
    };
  }, [files]);
}

// Branding

export interface BrandingSettings {
  logo?: string;
  favicon?: string;
  og_default?: string;
}

export function useBrandingSettings(): BrandingSettings {
  const files = import.meta.glob("/content/settings/branding.json", {
    eager: true,
    import: "default",
  });

  return useMemo(() => {
    const data =
      (files["/content/settings/branding.json"] as BrandingSettings | undefined) ?? {
        logo: "/images/uploads/logo.png",
        favicon: "/favicon.ico",
      };
    return data;
  }, [files]);
}

