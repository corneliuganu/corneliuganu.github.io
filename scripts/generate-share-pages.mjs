import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://corneliuganu.github.io";
const PORTFOLIO_DIR = path.join(__dirname, "..", "content", "portfolio");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "portofoliu");
const SEO_DIR = path.join(__dirname, "..", "content", "seo");

function slugify(input) {
  return String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toAbsoluteUrl(url) {
  if (!url) return `${BASE_URL}/images/uploads/CIB.jpg`;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildShareHtml({ canonicalUrl, title, description, imageUrl }) {
  const safeCanonical = escapeHtml(canonicalUrl);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(imageUrl);

  return `<!doctype html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeCanonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <script>
      (function () {
        var path = window.location.pathname;
        var search = window.location.search || "";
        var hash = window.location.hash || "";
        var target = "/?p=" + encodeURIComponent(path) + (search ? "&" + search.slice(1) : "") + hash;
        window.location.replace(target);
      })();
    </script>
  </head>
  <body></body>
</html>
`;
}

async function readSeoFile(fileName) {
  const filePath = path.join(SEO_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function parseEntry(fileName) {
  const filePath = path.join(PORTFOLIO_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  const fm = match ? YAML.parse(match[1]) ?? {} : {};

  const fileSlug = fileName.replace(/\.md$/, "");
  const customSlug = slugify(fm.url_slug || fm.slug || "");
  const slug = customSlug || fileSlug;

  const title = fm.title || "Galerie foto";
  const category = fm.category || "Portofoliu";
  const description =
    fm.description || `Galerie foto ${title} — ${category}.`;
  const imageUrl = toAbsoluteUrl(fm.image);
  const canonicalUrl = `${BASE_URL}/portofoliu/${slug}`;

  return { slug, title, description, imageUrl, canonicalUrl };
}

async function generate() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const files = (await fs.readdir(PORTFOLIO_DIR)).filter((f) => f.endsWith(".md"));

  for (const fileName of files) {
    const entry = await parseEntry(fileName);
    const outDir = path.join(OUTPUT_DIR, entry.slug);
    const outFile = path.join(outDir, "index.html");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, buildShareHtml(entry), "utf8");
  }

  // Static share pages for main SPA routes to avoid 404 in social scrapers.
  const [seoPortfolio, seoAbout, seoContact] = await Promise.all([
    readSeoFile("portfolio.json"),
    readSeoFile("about.json"),
    readSeoFile("contact.json"),
  ]);

  const staticPages = [
    {
      route: "portofoliu",
      canonicalUrl: `${BASE_URL}/portofoliu`,
      title: seoPortfolio.title || "Portofoliu | Cornel Iuganu Photography",
      description:
        seoPortfolio.description ||
        "Explorează portofoliul meu de fotografie de evenimente: nunți, botezuri, portrete și peisaje.",
      imageUrl: toAbsoluteUrl(seoPortfolio.og_image),
    },
    {
      // Common misspelling alias; keeps share preview working.
      route: "portofolio",
      canonicalUrl: `${BASE_URL}/portofoliu`,
      title: seoPortfolio.title || "Portofoliu | Cornel Iuganu Photography",
      description:
        seoPortfolio.description ||
        "Explorează portofoliul meu de fotografie de evenimente: nunți, botezuri, portrete și peisaje.",
      imageUrl: toAbsoluteUrl(seoPortfolio.og_image),
    },
    {
      route: "despre",
      canonicalUrl: `${BASE_URL}/despre`,
      title: seoAbout.title || "Despre | Cornel Iuganu Photography",
      description:
        seoAbout.description ||
        "Află povestea din spatele obiectivului. Cornel Iuganu. Fotograf profesionist cu peste 20 ani de experiență.",
      imageUrl: toAbsoluteUrl(seoAbout.og_image),
    },
    {
      route: "contact",
      canonicalUrl: `${BASE_URL}/contact`,
      title: seoContact.title || "Contact | Cornel Iuganu Photography",
      description:
        seoContact.description ||
        "Contactează-mă pentru evenimentul tău. Cornel Iuganu. Fotograf profesionist de evenimente.",
      imageUrl: toAbsoluteUrl(seoContact.og_image),
    },
  ];

  for (const page of staticPages) {
    const outDir = path.join(__dirname, "..", "public", page.route);
    const outFile = path.join(outDir, "index.html");
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, buildShareHtml(page), "utf8");
  }

  // eslint-disable-next-line no-console
  console.log(
    `Share pages generated for ${files.length} portfolio entries and ${staticPages.length} static routes.`
  );
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate share pages:", err);
  process.exitCode = 1;
});
