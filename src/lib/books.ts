import { getCollection, type CollectionEntry } from "astro:content";

export type Eser = CollectionEntry<"books">["data"];

/**
 * Katalog yardımcıları.
 *
 * SAYILAR BURADAN HESAPLANIYOR, sayfalara elle yazılmıyor. `books.json`'a
 * bir eser eklendiğinde ana sayfadaki "52 eser" yazısının da güncellenmesi
 * gerekseydi, ikisi ilk eklemede ayrışır ve site kendi kataloğu hakkında
 * yanlış konuşmaya başlardı.
 */

/** `guven: dusuk` kayıtlar Muharrem Tan onaylayana kadar yayında görünmez. */
export function yayindaMi(e: Eser): boolean {
  return e.guven !== "dusuk" || e.approved === true;
}

/** En erken baskı yılı — kronoloji ve sıralama bunun üzerinden. */
export function ilkYil(e: Eser): number | null {
  const yillar = e.editions
    .map((b) => b.year ?? (b.date ? Number(b.date.slice(0, 4)) : null))
    .filter((y): y is number => typeof y === "number" && y > 1900);
  return yillar.length ? Math.min(...yillar) : null;
}

export function sonYil(e: Eser): number | null {
  const yillar = e.editions
    .map((b) => b.year ?? (b.date ? Number(b.date.slice(0, 4)) : null))
    .filter((y): y is number => typeof y === "number" && y > 1900);
  return yillar.length ? Math.max(...yillar) : null;
}

/** İlk baskının yayınevi — kartlarda gösterilen künye. */
export function ilkYayinevi(e: Eser): string {
  const sirali = [...e.editions].sort(
    (a, b) => (a.year ?? 9999) - (b.year ?? 9999),
  );
  return sirali[0]?.publisher ?? "";
}

export async function tumEserler(): Promise<Eser[]> {
  const kayitlar = await getCollection("books");
  return kayitlar
    .map((k) => k.data)
    .filter(yayindaMi)
    .sort((a, b) => (sonYil(b) ?? 0) - (sonYil(a) ?? 0));
}

export const ROL_ADLARI: Record<Eser["role"], string> = {
  ceviri: "Çeviri",
  "ortak-ceviri": "Ortak çeviri",
  telif: "Telif",
  derleme: "Derleme",
  editor: "Editörlük",
  "uyarlama-belirsiz": "Uyarlama",
};

export const KATEGORI_ADLARI: Record<Eser["category"], string> = {
  tasavvuf: "Tasavvuf",
  "hadis-sunnet": "Hadis ve sünnet",
  siyer: "Siyer",
  "akaid-kelam": "Akaid ve kelam",
  fikih: "Fıkıh",
  ahlak: "Ahlak",
  tefsir: "Tefsir",
  dusunce: "Düşünce",
  "tarih-biyografi": "Tarih ve biyografi",
  "dinler-mezhepler": "Dinler ve mezhepler",
  roman: "Roman",
  "siyaset-guncel": "Siyaset ve güncel",
  "dua-maneviyat": "Dua ve maneviyat",
  aile: "Aile",
  "cocuk-genc": "Çocuk ve gençlik",
  karikatur: "Karikatür",
  "genel-kultur": "Genel kültür",
};

export const HEDEF_ADLARI: Record<string, string> = {
  genel: "Genel okur",
  cocuk: "Çocuk ve gençlik",
  "ebeveyn-egitimci": "Ebeveyn ve eğitimci",
};

/**
 * Kategori renkleri — raf görünümündeki kitap sırtları ve tipografik
 * kapaklar bu renkten doğuyor. Paletteki dört renk tekrar ediyor; kategori
 * başına ayrı renk icat etmek, 17 renkli bir sayfa demekti.
 */
export const KATEGORI_RENKLERI: Record<Eser["category"], string> = {
  tasavvuf: "var(--murekkep)",
  "hadis-sunnet": "var(--murekkep)",
  siyer: "var(--turkuaz)",
  "akaid-kelam": "var(--murekkep)",
  fikih: "var(--murekkep)",
  ahlak: "var(--turkuaz)",
  tefsir: "var(--murekkep)",
  dusunce: "var(--nar)",
  "tarih-biyografi": "var(--nar)",
  "dinler-mezhepler": "var(--nar)",
  roman: "var(--bakir)",
  "siyaset-guncel": "var(--nar)",
  "dua-maneviyat": "var(--turkuaz)",
  aile: "var(--bakir)",
  "cocuk-genc": "var(--bakir)",
  karikatur: "var(--bakir)",
  "genel-kultur": "var(--turkuaz)",
};

export type Istatistik = {
  eser: number;
  yayinevi: number;
  ilkYil: number;
  sonYil: number;
  yil: number;
  yazar: number;
  ceviri: number;
};

export function istatistikler(eserler: Eser[]): Istatistik {
  const yayinevleri = new Set<string>();
  const yazarlar = new Set<string>();
  let enErken = Infinity;
  let enGec = 0;

  for (const e of eserler) {
    for (const b of e.editions) yayinevleri.add(b.publisher);
    if (e.originalAuthor) yazarlar.add(e.originalAuthor);
    const i = ilkYil(e);
    const s = sonYil(e);
    if (i && i < enErken) enErken = i;
    if (s && s > enGec) enGec = s;
  }

  return {
    eser: eserler.length,
    yayinevi: yayinevleri.size,
    ilkYil: enErken === Infinity ? 0 : enErken,
    sonYil: enGec,
    yil: enGec && enErken !== Infinity ? enGec - enErken : 0,
    yazar: yazarlar.size,
    ceviri: eserler.filter((e) => e.role === "ceviri" || e.role === "ortak-ceviri").length,
  };
}

/**
 * Yazar adından bağlantı kimliği üretir.
 *
 * İKİ AŞAMA GEREKİYOR: önce Türkçe harfler elle karşılanıyor (ı → i, ğ → g;
 * Unicode normalizasyonu bunları doğru çevirmiyor), sonra kalan aksanlar
 * (â, î, û, ā, ʿ gibi transliterasyon işaretleri) normalize edilip
 * atılıyor. İkincisi olmadan "Mâlik b. Nebî" → "m-lik-b-neb" gibi okunmaz
 * bir çıpa üretiliyordu.
 */
export function yazarKimligi(ad: string): string {
  return ad
    .replace(/\(.*?\)/g, "")
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (h) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[h] ?? h)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function yazaraGore(eserler: Eser[]) {
  const harita = new Map<string, { ad: string; kimlik: string; eserler: Eser[] }>();
  for (const e of eserler) {
    if (!e.originalAuthor) continue;
    const kimlik = yazarKimligi(e.originalAuthor);
    if (!harita.has(kimlik)) {
      harita.set(kimlik, { ad: e.originalAuthor, kimlik, eserler: [] });
    }
    harita.get(kimlik)!.eserler.push(e);
  }
  return [...harita.values()].sort(
    (a, b) => b.eserler.length - a.eserler.length || a.ad.localeCompare(b.ad, "tr"),
  );
}

export function kategoriyeGore(eserler: Eser[], kategoriler: Eser["category"][]) {
  return eserler.filter((e) => kategoriler.includes(e.category));
}
