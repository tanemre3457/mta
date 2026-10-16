import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

/**
 * Eser kataloğu — tek doğruluk kaynağı `data/books.json`.
 *
 * Şema `_meta` içindeki sözlüklere birebir bağlı: enum dışı bir rol ya da
 * kategori girildiğinde build KIRILIYOR. Sessizce kabul edilen bir yazım
 * hatası, o eseri hiçbir filtreye düşmeden kataloğun içinde kaybediyor.
 */
const baski = z.object({
  publisher: z.string(),
  /** Bazı kayıtlarda yalnızca yıl, bazılarında tam tarih var. */
  year: z.number().optional(),
  date: z.string().optional(),
  city: z.string().optional(),
  pages: z.number().optional(),
  isbn: z.string().optional(),
  /** Dizi ciltlerinin ayrı baskı kaydı olduğunda cildin kendi adı. */
  title: z.string().optional(),
  note: z.string().optional(),
});

/** Dizi ciltleri: tek kayıt altında cilt listesi. */
const cilt = z.object({
  title: z.string(),
  pages: z.number().optional(),
  isbn: z.string().optional(),
  note: z.string().optional(),
});

const books = defineCollection({
  loader: file("data/books.json", { parser: (metin) => JSON.parse(metin).books }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string().nullable().optional(),
    originalTitle: z.string().optional(),
    originalAuthor: z.string().nullable().optional(),
    contributors: z.array(z.string()).optional(),
    role: z.enum([
      "ceviri",
      "ortak-ceviri",
      "telif",
      "derleme",
      "editor",
      "uyarlama-belirsiz",
    ]),
    category: z.enum([
      "tasavvuf",
      "hadis-sunnet",
      "siyer",
      "akaid-kelam",
      "fikih",
      "ahlak",
      "tefsir",
      "dusunce",
      "tarih-biyografi",
      "dinler-mezhepler",
      "roman",
      "siyaset-guncel",
      "dua-maneviyat",
      "aile",
      "cocuk-genc",
      "karikatur",
      "genel-kultur",
    ]),
    audience: z.enum(["genel", "cocuk", "ebeveyn-egitimci"]).optional(),
    series: z.string().nullable().optional(),
    volumes: z.array(cilt).optional(),
    editions: z.array(baski),
    summary: z.string().optional(),
    not: z.string().optional(),
    featured: z.boolean().optional(),
    /** Kitapçı CDN'i — HOTLİNK EDİLMİYOR, yalnızca künye referansı. */
    coverRemote: z.string().nullable().optional(),
    sources: z.array(z.string()).default([]),
    guven: z.enum(["yuksek", "orta", "dusuk"]),
    /** Muharrem Tan onayladığında `dusuk` kayıt da yayına çıkıyor. */
    approved: z.boolean().optional(),
  }),
});

export const collections = { books };
