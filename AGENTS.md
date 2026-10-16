# CLAUDE.md — Muharrem Tan web sitesi

Mütercim-yazar **Muharrem Tan** için kişisel yazar/çevirmen sitesi kuruyorsun.

## Önce oku
1. `INFO.md` — biyografi, kronoloji, iletişim, tasarım kimliği (renk, font, motif, loader), site haritası, hukuki kurallar.
2. `ROADMAP.md` — teknik yığın (Astro 5 + Tailwind v4), klasör yapısı, 6 faz ve kabul kriterleri.
3. `data/books.json` — eser kataloğu (tek doğruluk kaynağı). Elle düzeltme gerekirse önce kullanıcıya sor.

## Kesin kurallar
- Arayüz dili Türkçe; `lang="tr"`. Türkçe karakterleri ve İ/ı büyük-küçük dönüşümünü test et.
- İslami estetik **ölçülü**: geometrik motifler (sekiz köşeli yıldız, girih, rumi ayraç) + Balkan dokunuşu (kilim bordürü, Mostar kemeri çizgisi, bakır tonu). Klişe görsel, stok cami/kaligrafi fotoğrafı yok.
- Loader: kendi kendini çizen sekiz köşeli yıldız, ≤1.2s, yalnızca ilk ziyaret, reduced-motion'da kapalı.
- Kitapçı sitelerinden kapak **hotlink etme**; kapak yoksa SVG tipografik kapak üret.
- `guven: "dusuk"` eserleri yayında gösterme (`approved: true` olana dek).
- Bilinmeyen bilgiyi uydurma (fotoğraf, ödül, yazı, alıntı). Eksikse yer tutucu değil, "derleniyor" durumu göster.
- Sayıları (eser, yayınevi, yıl aralığı) koddan hesapla.
- İletişim: muharremtan@gmail.com · +90 532 590 97 80 (WhatsApp: wa.me/905325909780).

## Komutlar (kurulumdan sonra)
- `npm run dev` · `npm run build` · `npm test` · `npx astro check`
