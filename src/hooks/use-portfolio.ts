import { useMemo } from "react";
import YAML from "yaml";

export interface PortfolioPhoto {
  src: string;
  alt: string;
}

export interface PortfolioEntry {
  title: string;
  category: string;
  image: string;
  description?: string;
  date: string;
  featured?: boolean;
  slug: string;
  photos: PortfolioPhoto[];
}

const portfolioFiles = import.meta.glob("/content/portfolio/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const imageModules = import.meta.glob("/src/assets/portfolio-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveImage(imagePath: string | undefined): string {
  if (!imagePath) return "";
  const filename = imagePath.split("/").pop();
  const match = Object.entries(imageModules).find(([key]) =>
    key.endsWith(`/${filename}`)
  );
  return match ? match[1] : imagePath;
}

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  return YAML.parse(match[1]) ?? {};
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePortfolioEntries(): PortfolioEntry[] {
  return Object.entries(portfolioFiles).map(([filepath, raw]) => {
    const text = raw as string;
    const data = parseFrontmatter(text);
    const fileSlug = filepath.split("/").pop()?.replace(".md", "") || "";
    const customSlugRaw =
      (data.url_slug as string | undefined) ||
      (data.slug as string | undefined) ||
      "";
    const customSlug = slugify(customSlugRaw.trim());
    const slug = customSlug || fileSlug;

    const explicitPhotos: PortfolioPhoto[] = Array.isArray(data.photos)
      ? (data.photos as { image?: string; alt?: unknown }[]).map((p) => ({
          src: resolveImage(p.image),
          alt: typeof p.alt === "string" ? p.alt : "",
        }))
      : [];

    const bulkPhotos: PortfolioPhoto[] = Array.isArray(data.photos_bulk)
      ? (data.photos_bulk as unknown[]).map((p) => ({
          src: resolveImage(typeof p === "string" ? p : undefined),
          alt: "",
        })).filter((p) => Boolean(p.src))
      : [];

    const photos = [...explicitPhotos];
    for (const p of bulkPhotos) {
      if (!photos.some((x) => x.src === p.src)) photos.push(p);
    }

    return {
      title: (data.title as string) || "",
      category: (data.category as string) || "",
      image: resolveImage(data.image as string | undefined),
      description: data.description as string | undefined,
      date: data.date ? new Date(data.date as string).toISOString() : "",
      featured: data.featured === true,
      slug,
      photos,
    };
  });
}

export function usePortfolio() {
  const entries = useMemo(() => parsePortfolioEntries(), []);

  const latestByCategory = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const seen = new Set<string>();
    return sorted.filter((entry) => {
      if (seen.has(entry.category)) return false;
      seen.add(entry.category);
      return true;
    });
  }, [entries]);

  return { entries, latestByCategory };
}
