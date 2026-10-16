import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Yüklenmiş görsellerin listesi.
 *
 * NEDEN DOSYA SİSTEMİ: kapaklar ve portre `public/` altına elle konuyor
 * (yayınevinden/Muharrem Tan'dan izinle). Hangi kapağın geldiğini bir
 * listede ayrıca tutmak, dosya konulduğu hâlde sitede görünmemesi demekti —
 * iki yerin elle eşlenmesi ilk unutmada bozuluyor. Build anında klasöre
 * bakmak bu eşlemeyi gereksiz kılıyor.
 */
const kok = process.cwd();

/** Yalnızca görseller sayılıyor: klasördeki README gibi dosyalar portre
 *  ya da kapak yerine geçip kırık görsel üretmesin. */
const GORSEL = /\.(avif|webp|jpg|jpeg|png|gif)$/i;

function dosyalar(klasor: string): Map<string, string> {
  const yol = join(kok, "public", klasor);
  const harita = new Map<string, string>();
  if (!existsSync(yol)) return harita;
  for (const ad of readdirSync(yol)) {
    if (!GORSEL.test(ad)) continue;
    const nokta = ad.lastIndexOf(".");
    if (nokta < 1) continue;
    harita.set(ad.slice(0, nokta), `/${klasor}/${ad}`);
  }
  return harita;
}

const kapaklar = dosyalar("covers");
const portreler = dosyalar("portre");

/** Eserin kapağı yüklenmişse yolu, değilse null. */
export function kapakYolu(slug: string): string | null {
  return kapaklar.get(slug) ?? null;
}

/** Portre fotoğrafı yüklenmişse yolu, değilse null. */
export function portreYolu(): string | null {
  return portreler.get("muharrem-tan") ?? [...portreler.values()][0] ?? null;
}

export const kapakSayisi = kapaklar.size;
