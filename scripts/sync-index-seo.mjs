import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://corneliuganu.github.io";
const INDEX_PATH = path.join(__dirname, "..", "index.html");
const SEO_HOME_PATH = path.join(__dirname, "..", "content", "seo", "home.json");

function toAbsoluteUrl(url) {
  if (!url) return `${BASE_URL}/images/uploads/CIB.jpg`;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function run() {
  const [indexRaw, seoRaw] = await Promise.all([
    fs.readFile(INDEX_PATH, "utf8"),
    fs.readFile(SEO_HOME_PATH, "utf8"),
  ]);

  const seo = JSON.parse(seoRaw);
  const title = seo.title || "Cornel Iuganu | Fotograf Profesionist de Evenimente";
  const description =
    seo.description ||
    "Cornel Iuganu. Fotograf profesionist de evenimente din Romania. Nunti, botezuri, evenimente corporate. Captez momentele care conteaza.";
  const canonical = seo.canonical || `${BASE_URL}/`;
  const ogImage = toAbsoluteUrl(seo.og_image);

  const seoBlock = `    <!-- SEO_STATIC_START -->
    <title>${esc(title)}</title>
    <meta
      name="description"
      content="${esc(description)}"
    />
    <meta name="author" content="Cornel Iuganu" />
    <link rel="canonical" href="${esc(canonical)}" />

    <meta property="og:title" content="${esc(title)}" />
    <meta
      property="og:description"
      content="${esc(description)}"
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:secure_url" content="${esc(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta
      name="twitter:description"
      content="${esc(description)}"
    />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <!-- SEO_STATIC_END -->`;

  const next = indexRaw.replace(
    /<!-- SEO_STATIC_START -->[\s\S]*?<!-- SEO_STATIC_END -->/,
    seoBlock
  );

  if (next === indexRaw) {
    throw new Error("SEO marker block not found in index.html");
  }

  await fs.writeFile(INDEX_PATH, next, "utf8");
  // eslint-disable-next-line no-console
  console.log("index.html SEO block synced from content/seo/home.json");
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to sync index SEO:", err);
  process.exitCode = 1;
});

