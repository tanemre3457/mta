# Muharrem Tan Web Sitesi — Proje Yol Haritası (Claude Code için)

> **Okuma sırası:** `CLAUDE.md` → `INFO.md` (içerik + tasarım kimliği) → bu dosya → `data/books.json`.
> Her faz sonunda: `npm run build` hatasız, Lighthouse ≥ 95 (Perf/A11y/SEO/Best), değişiklikler commit.
> Dil: arayüz ve içerik **Türkçe**. Kod yorumları İngilizce olabilir.

---

## 0. Teknik kararlar

| Konu | Seçim | Gerekçe |
|---|---|---|
| Framework | **Astro 5** (static output) | İçerik ağırlıklı site, sıfır JS varsayılanı, Content Collections, View Transitions |
| Stil | **Tailwind CSS v4** + CSS değişkenleri (INFO §3.2) | Hızlı, tema değişkenleriyle tutarlı |
| Etkileşim adaları | Vanilla TS (+ gerekirse küçük Preact adası: filtre/arama) | Hafif |
| İçerik | Astro Content Collections: `books` (JSON loader → `data/books.json`), `yazilar` (MDX), `basin` (MDX) | Tip güvenli şema (Zod) |
| Arama | **Pagefind** (build-time statik indeks) | Sunucusuz, Türkçe destekli |
| Fontlar | `@fontsource` ile self-host: Cormorant Garamond, EB Garamond, Inter, Amiri | KVKK + performans |
| Form | Web3Forms veya Formspree (ücretsiz katman) → muharremtan@gmail.com | Sunucusuz |
| Görseller | `astro:assets` → AVIF/WebP, `public/covers/` | |
| Deploy | **Vercel** veya **Netlify** (Git push → otomatik) ; alan adı `muharremtan.com` | |
| Analitik | Plausible veya Umami (çerezsiz) — opsiyonel | KVKK dostu |
| Test | Playwright (smoke + a11y via axe), `astro check`, JSON şema doğrulama | |

### Klasör yapısı
```
muharrem-tan-site/
├─ CLAUDE.md  INFO.md  ROADMAP.md
├─ data/books.json
├─ public/ covers/  og/  favicon.svg  robots.txt
├─ src/
│  ├─ content.config.ts          # Zod şemaları
│  ├─ content/yazilar/*.mdx
│  ├─ content/basin/*.mdx
│  ├─ components/
│  │  ├─ motifs/ Star8.astro Girih12.astro RumiDivider.astro KilimBorder.astro MostarLine.astro TezhipCorner.astro
│  │  ├─ Loader.astro  Header.astro  Footer.astro  ThemeToggle.astro
│  │  ├─ BookCard.astro  BookCover.astro (SVG yedek kapak)  BookShelf.astro  BookGrid.astro
│  │  ├─ FilterBar.tsx  Timeline.astro  StatsBand.astro  JourneyMap.astro
│  │  └─ ContactCard.astro  ContactForm.astro
│  ├─ layouts/ BaseLayout.astro  PageLayout.astro
│  ├─ lib/ books.ts (sıralama, sayım, gruplama)  seo.ts (JSON-LD)  slug.ts (Türkçe slug)
│  ├─ pages/ index.astro  hakkinda.astro  eserler/index.astro  eserler/[slug].astro
│  │         yazarlar/index.astro  yazilar/index.astro  yazilar/[slug].astro
│  │         akademik.astro  basin.astro  iletisim.astro  404.astro  rss.xml.ts  sitemap (integration)
│  └─ styles/ global.css  motifs.css
└─ tests/ smoke.spec.ts  a11y.spec.ts  data.test.ts
```

---

## Faz 1 — İskelet ve tasarım sistemi (gün 1)
1. `npm create astro@latest` (minimal, TS strict). Tailwind v4, `@astrojs/sitemap`, `@astrojs/mdx`, `astro-pagefind` ekle.
2. `global.css`: INFO §3.2 renk değişkenleri, açık/koyu tema (`data-theme` + `prefers-color-scheme`), kâğıt dokusu (SVG `feTurbulence`, %4).
3. Fontları self-host et; `lang="tr"`; Türkçe büyük harf testi sayfası (`/dev/tipografi`, prod'da hariç) — "İSTANBUL, ıĞŞÇÖÜ âîû" doğru görünmeli.
4. **Motif bileşenleri** (INFO §3.4): her biri `viewBox`'lı, `stroke="currentColor"`, `aria-hidden`. Sekiz köşeli yıldız: iki üst üste 45° döndürülmüş kare + iç sekizgen; geometri kodla üretilsin (trig), elle yol kopyalanmasın.
5. `BaseLayout`: header (logo = yıldız + "Muharrem Tan" + altta küçük Amiri ile ترجمان), nav, footer (kilim bordürü + Mostar çizgi illüstrasyonu + iletişim + telif satırı).
6. **Kabul:** tasarım sistemi sayfası tüm renkleri, fontları, motifleri gösteriyor; koyu mod çalışıyor; kontrast AA.

## Faz 2 — Veri katmanı (gün 1–2)
1. `content.config.ts`: `books` koleksiyonu `file('data/books.json', { parser: d => d.books })`. Zod şeması `books.json` alanlarına birebir (rol/kategori enum'ları `_meta`'dan).
2. `lib/books.ts`:
   - `firstYear(book)` → editions içindeki en küçük `year` veya `date` yılı.
   - `isPublished(book)` → `guven !== 'dusuk'` **veya** `approved: true`.
   - İstatistikler (eser sayısı, yayınevi sayısı, ilk-son yıl) **buradan hesaplanır**.
   - Gruplama: role, category, publisher, decade, audience, series.
3. `tests/data.test.ts`: slug benzersiz, ISBN formatı (10/13, X kabul), her kaydın ≥1 kaynağı var, enum dışı değer yok.
4. **Kabul:** `astro check` temiz; test geçer; 50+ hedefiyle mevcut sayı arasındaki fark konsola uyarı olarak basılır.

## Faz 3 — Sayfalar (gün 2–4)
**Ana sayfa**
- Loader (INFO §3.5) → Hero (başlık, alt başlık, öne çıkan kitap yığını `featured: true`) → StatsBand (hesaplanan sayılar, sayaç animasyonu, reduced-motion'da statik) → "Klasikler" şeridi (tasavvuf/hadis/tarih) → "Çağdaş Düşünce ve Edebiyat" şeridi → "Çocuklar İçin" şeridi → Kısa biyografi + portre (yoksa girih rozeti) → Son yazılar (varsa) → İletişim CTA.

**/eserler**
- Üstte arama (Pagefind) + filtre çubuğu: Rol (Çeviri / Telif / Derleme / Editörlük), Kategori, Yayınevi, On yıl, Hedef kitle. URL query ile senkron (`?rol=ceviri&kategori=tasavvuf`).
- Görünüm anahtarı: **Raf** (dikey sırt, kategori rengi) ↔ **Izgara** (kapak kartları). Sıralama: yeni→eski (varsayılan), eski→yeni, A→Z.
- Kart: kapak (veya SVG yedek), başlık, orijinal yazar, yayınevi · yıl, rol rozeti.

**/eserler/[slug]**
- Sol: büyük kapak + tezhip köşebent; sağ: başlık, alt başlık, orijinal başlık (italik transliterasyon), orijinal yazar, rol, kategori.
- "Baskılar" tablosu (yayınevi, yıl, sayfa, ISBN). ISBN'lerden kitapyurdu / D&R / idefix arama linkleri (`https://www.kitapyurdu.com/index.php?route=product/search&filter_name=ISBN`).
- Özet, "Çevirmenin notu" (varsa), alıntı kartı (varsa), aynı yazardan / aynı diziden / aynı kategoriden öneriler.
- JSON-LD: `Book` + `translator`/`author` (`Person: Muharrem Tan`), `isbn`, `publisher`, `datePublished`, `inLanguage: tr`, `translationOfWork`.

**/hakkinda**
- Uzun biyografi (INFO §1.1), 12'li girih rozeti başlıkta, **Timeline** bileşeni (INFO §1.2; düğümler yıldız, scroll ile çizilen dikey çizgi), "Çeviri Yolculuğu" haritası (Boyabat → Kahire → İstanbul → Hindistan; Balkan yayında ince bir Saraybosna–Mostar kavisi süs olarak), eğitim ve tez kutusu, çevirdiği yazarlar etiket bulutu.

**/yazarlar** — yazar başına kart, altında o yazardan çevrilen eserler.
**/akademik** — tez künyesi + Marmara açık arşiv linki.
**/iletisim** — e-posta (tıkla-kopyala), telefon `tel:+905325909780`, WhatsApp `https://wa.me/905325909780`, form (ad, e-posta, konu: Çeviri teklifi / Yayınevi / Okur / Basın, mesaj, KVKK onayı), honeypot alanı.
**/404** — "Bu sayfa çeviride kayboldu" + yıldız animasyonu.

**Kabul:** tüm sayfalar mobil 360px'te taşmasız; klavye ile gezilebilir; her sayfada tek `h1`.

## Faz 4 — Yazılar, makaleler, basın (gün 4)
1. `yazilar` koleksiyonu (MDX): frontmatter `title, magazine, issue, date, type (makale|deneme|ceviri-makale|roportaj|kitap-tanitimi), pdf?, url?, excerpt`. 
2. Liste: dergi adına göre gruplama + yıl filtresi; "PDF'i aç" butonu; dergi kapakları için tipografik "dergi künyesi" kartı.
3. Koleksiyon boşken "Yazılar derleniyor" kartı — **sahte içerik yok**.
4. `basin` koleksiyonu aynı yapı. RSS: `/rss.xml` (yazılar + yeni kitaplar).
5. `books.json → yazilar.items` doluysa MDX'e dönüştüren küçük script: `npm run import:yazilar`.

## Faz 5 — Cila, erişilebilirlik, performans, SEO (gün 5)
- Loader ve tüm animasyonlar `prefers-reduced-motion` uyumlu; loader yalnızca ilk oturum.
- Astro View Transitions: sayfa geçişinde kapak görseli kart → detay arası `transition:name` ile akar.
- Görseller AVIF/WebP, `loading="lazy"`, `sizes`; LCP < 2.0s (4G), CLS < 0.05, JS < 30KB (filtre adası hariç).
- SEO: her sayfada başlık/açıklama; `Person` JSON-LD (ad, jobTitle "Mütercim", sameAs: ISNI, BnF, 1000Kitap, kitapyurdu), OG görselleri (Satori ile otomatik: başlık + yıldız motifi), `sitemap.xml`, `robots.txt`, kanonik URL'ler, Türkçe slug'lar.
- A11y: axe testleri sıfır ciddi hata; odak halkası `--turkuaz`; dekoratif SVG'ler `aria-hidden`; Arapça kelimeler `lang="ar" dir="rtl"`.

## Faz 6 — Yayın ve devir (gün 6)
1. GitHub repo → Vercel/Netlify; alan adı ve HTTPS; form uç noktası canlı e-posta testi.
2. `README.md`: içerik ekleme rehberi (yeni kitap = `books.json`'a kayıt + `public/covers/slug.webp`; yeni yazı = `src/content/yazilar/` altında MDX).
3. (Opsiyonel) Decap CMS veya Keystatic ile Muharrem Tan'ın kendisinin içerik girebileceği panel.
4. (Opsiyonel) `/en` kısa İngilizce tanıtım sayfası.

---

## Kontrol listesi (Claude Code her fazda)
- [ ] `npm run build` ve `npm test` geçiyor
- [ ] `guven: dusuk` kayıtlar yayında görünmüyor (onay bekliyor)
- [ ] Hiçbir dış CDN'den kapak görseli hotlink edilmiyor
- [ ] İletişim bilgileri doğru: muharremtan@gmail.com · +90 532 590 97 80
- [ ] Sayılar `books.json`'dan hesaplanıyor
- [ ] Koyu mod + reduced-motion + 360px mobil kontrol edildi
- [ ] Türkçe karakterler (İ/ı) büyük harf dönüşümlerinde doğru
