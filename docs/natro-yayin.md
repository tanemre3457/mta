# Natro'ya yayınlama

Site **tamamen statik**: her sayfa önceden HTML olarak üretiliyor. Sunucuda
PHP, Node ya da veritabanı çalışmıyor — Natro'nun en küçük paylaşımlı
paketi yeter.

---

## 1. Siteyi derle

```bash
cd ~/Projects/muharrem-tan-site
npm run build
```

Çıktı `dist/` klasörüne yazılır. Yüklenecek olan **`dist/` klasörünün
İÇİ**, klasörün kendisi değil.

## 2. Dosyaları yükle

**cPanel → Dosya Yöneticisi** (en kolay yol):

1. cPanel'e gir → **Dosya Yöneticisi** → `public_html` klasörünü aç.
2. İçinde Natro'nun koyduğu varsayılan `index.html` / `default.html` varsa sil.
3. `dist` klasörünün içindekileri seçip zip'le (`site.zip`), yükle, sonra
   cPanel'de **Extract** ile aç.
4. `.htaccess` dosyasının da yüklendiğini doğrula — Dosya Yöneticisi'nde
   **Settings → Show Hidden Files** açık olmalı, yoksa görünmez ve
   yüklenmemiş sanırsın.

**FTP ile** (FileZilla):

- Sunucu: Natro'nun verdiği FTP adresi · Port 21
- Uzak dizin: `/public_html`
- `dist/` içindeki her şeyi oraya kopyala. Gizli dosyaları göstermeyi aç
  (FileZilla → Sunucu → Gizli dosyaları göstermeye zorla).

## 3. Alan adını bağla

**Alan adı da Natro'daysa:** cPanel'de hosting paketine bağlı olduğundan
genelde ek bir şey gerekmez. Değilse Natro panelinde alan adının
**ad sunucuları (nameserver)** alanına hosting paketinin ad sunucularını
yaz (`ns1.natrocdn.com` / `ns2.natrocdn.com` gibi — doğrusu panelde yazar).

**Alan adı başka yerdeyse:** o firmanın panelinde A kaydını Natro'nun
verdiği IP'ye yönlendir, `www` için CNAME olarak alan adını göster.

Yayılma 30 dakika ile birkaç saat arasında sürer.

## 4. SSL (https) aç

cPanel → **SSL/TLS Status** → **Run AutoSSL**. Sertifika geldikten SONRA
`public_html/.htaccess` içindeki şu iki satırın başındaki `#` işaretini
kaldır:

```
# RewriteCond %{HTTPS} !=on
# RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

**Sertifika gelmeden açma** — site hiç açılmaz.

## 5. Alan adı muharremtan.com değilse

`astro.config.mjs` içindeki `site` değerini değiştir ve yeniden derle.
Bu değer kanonik adresleri, `sitemap-index.xml` ve paylaşım etiketlerini
besliyor; yanlış kalırsa Google siteyi yanlış adresle indeksler.

```js
site: "https://muharremtan.com",   // ← burayı değiştir
```

`public/robots.txt` içindeki sitemap satırını da aynı adresle güncelle.

---

## Sonradan içerik eklemek

| Ne eklenecek | Nereye | Sonra |
|---|---|---|
| Yeni kitap | `data/books.json` → `books` dizisine yeni kayıt | `npm run build`, `dist/` yükle |
| Kitap kapağı | `public/covers/<slug>.webp` | aynı |
| Portre fotoğrafı | `public/portre/muharrem-tan.jpg` | aynı |
| Dergi yazısı | `data/books.json` → `yazilar.items` dizisi | aynı |

Kapak ya da fotoğraf dosyası konulduğu anda site onu kullanır; kod
değişikliği gerekmez.

## İletişim formu

Form şu an **bağlı değil**; gönderildiğinde "lütfen e-posta ya da WhatsApp
ile yazın" uyarısı verir — sessizce kaybolan mesaj olmaz.

Bağlamak için: [web3forms.com](https://web3forms.com) üzerinden
`muharremtan@gmail.com` ile ücretsiz bir anahtar al, sonra
`src/pages/iletisim.astro` içindeki şu satıra yapıştır:

```html
<input type="hidden" name="access_key" value="" />
```
