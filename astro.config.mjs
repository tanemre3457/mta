// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/**
 * Statik çıktı: site içerik ağırlıklı ve hiçbir sayfası istek anında
 * hesaplanmıyor. Natro gibi paylaşımlı barındırmaya `dist/` klasörünü
 * olduğu gibi yüklemek yetiyor — Node çalıştırmak gerekmiyor.
 */
export default defineConfig({
  site: "https://muharremtan.com",
  output: "static",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: "auto" },
  image: { responsiveStyles: true },
});
