# Muharrem Tan — kişisel site

Mütercim ve yazar Muharrem Tan'ın eser kataloğu, biyografisi ve iletişim
sayfası. Astro 7 ile üretilen **tamamen statik** bir site: sunucuda hiçbir
şey çalışmıyor, paylaşımlı barındırmaya `dist/` klasörü yükleniyor.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne üretir
npm run preview  # üretilmiş hâli yerelde açar
```

## Yapı

```
data/books.json        Eser kataloğu — TEK doğruluk kaynağı
docs/INFO.md           Biyografi, tasarım kimliği, hukuki kurallar
docs/ROADMAP.md        Teknik yol haritası
docs/natro-yayin.md    Natro'ya yükleme adımları
public/covers/         Kitap kapakları (<slug>.webp)
public/portre/         Portre fotoğrafı (muharrem-tan.jpg)
src/components/motifs/ Sekiz köşeli yıldız, girih, rumi ayraç, kilim, Mostar
src/lib/books.ts       Sayım, gruplama, sıralama — sayılar BURADAN hesaplanır
```

## Kurallar

- **Sayılar elle yazılmaz.** "53 eser", "22 yayınevi" gibi değerler
  `data/books.json` üzerinden hesaplanıyor. Kataloğa kayıt eklendiğinde
  sayılar kendiliğinden güncelleniyor.
- **`guven: "dusuk"` kayıtlar yayında görünmez.** Muharrem Tan onayladığında
  kayda `"approved": true` eklenir ve yayına çıkar.
- **Kapak hotlink edilmez.** `books.json` içindeki `coverRemote` alanları
  yalnızca künye referansıdır; kapaklar yayınevinden izinle alınıp
  `public/covers/` altına konur.
- **Olmayan bilgi uydurulmaz.** Yazı listesi boşken "derleniyor" kartı
  gösterilir; temsilî içerik konmaz.

## Eser ekleme

`data/books.json` → `books` dizisine ekle:

```json
{
  "slug": "ornek-kitap",
  "title": "Örnek Kitap",
  "originalAuthor": "Yazar Adı",
  "role": "ceviri",
  "category": "tasavvuf",
  "audience": "genel",
  "editions": [{ "publisher": "Yayınevi", "year": 2026, "pages": 240, "isbn": "9786050000000" }],
  "summary": "Bir iki cümlelik özet.",
  "sources": ["https://kaynak-adresi"],
  "guven": "yuksek"
}
```

Şema `src/content.config.ts` içinde tanımlı; hatalı bir alan girilirse
`npm run build` **durur** ve hangi kaydın hatalı olduğunu söyler.
