import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://corneliuganu.github.io";

async function getPortfolioSlugs() {
  const contentDir = path.join(__dirname, "..", "content", "portfolio");
  let entries;
  try {
    entries = await fs.readdir(contentDir);
  } catch {
    return [];
  }

  return entries
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function buildUrl(loc) {
  return `${BASE_URL}${loc}`;
}

async function generate() {
  const pages = [
    "/",
    "/portofoliu",
    "/despre",
    "/contact",
  ];

  const portfolioSlugs = await getPortfolioSlugs();

  const urls = [
    ...pages.map((p) => buildUrl(p)),
    ...portfolioSlugs.map((slug) => buildUrl(`/portofoliu/${slug}`)),
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${loc === BASE_URL + "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  await fs.writeFile(outPath, xml, "utf8");
  // eslint-disable-next-line no-console
  console.log(`Sitemap generated at ${outPath}`);
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate sitemap:", err);
  process.exitCode = 1;
});

