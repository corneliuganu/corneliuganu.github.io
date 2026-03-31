import { useMemo } from "react";

export interface HomeFeaturedWork {
  slug: string;
  title: string;
  category: string;
  image: string;
  date: string;
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

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseEntries(): HomeFeaturedWork[] {
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

    return {
      slug,
      title: (data.title as string) || "",
      category: (data.category as string) || "",
      image: resolveImage(data.image as string | undefined),
      date: data.date ? new Date(data.date as string).toISOString() : "",
    };
  });
}

export function useHomeFeaturedWorks() {
  return useMemo(() => {
    const sorted = [...parseEntries()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const seen = new Set<string>();
    return sorted.filter((entry) => {
      if (!entry.category || seen.has(entry.category)) return false;
      seen.add(entry.category);
      return true;
    });
  }, []);
}
