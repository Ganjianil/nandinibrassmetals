/**
 * Run after build or when products change:
 *   node scripts/generate-sitemap.js
 * Requires VITE_API_BASE_URL or defaults to production API.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL =
  process.env.VITE_SITE_URL || "https://nandhinicrafts.netlify.app";
const API_BASE =
  process.env.VITE_API_BASE_URL || "https://nandinibrassmetals.vercel.app";

const staticPaths = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/custom-order", priority: "0.8", changefreq: "weekly" },
];

const urlEntry = ({ loc, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${loc === "/" ? "/" : loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

async function main() {
  let productUrls = [];
  let categoryUrls = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE}/products`),
      fetch(`${API_BASE}/api/categories`),
    ]);

    if (productsRes.ok) {
      const products = await productsRes.json();
      productUrls = products.map((p) => ({
        loc: `/product/${p.id}`,
        priority: "0.7",
        changefreq: "weekly",
      }));
    }

    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      categoryUrls = categories.map((c) => ({
        loc: `/category/${c.id}`,
        priority: "0.8",
        changefreq: "weekly",
      }));
    }
  } catch (err) {
    console.warn("Could not fetch products for sitemap:", err.message);
  }

  const all = [...staticPaths, ...categoryUrls, ...productUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(urlEntry).join("\n")}
</urlset>
`;

  const outDir = path.join(__dirname, "..", "public");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
  console.log(`Sitemap written with ${all.length} URLs`);
}

main();
