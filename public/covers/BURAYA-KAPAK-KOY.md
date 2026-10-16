# Kitap kapakları

Her kapağı kitabın **slug**'ıyla aynı adla bu klasöre koy:

    public/covers/kutul-kulub-kalplerin-azigi.webp
    public/covers/osmanli-bilginleri.jpg

Slug'lar `data/books.json` içindeki `slug` alanlarıdır. Dosya konulduğu anda
site o kitabın tipografik kapağı yerine gerçek kapağı gösterir; kod
değişikliği gerekmez.

Kitapçı sitelerinden görsel indirip koyma — kapaklar yayınevinden ya da
Muharrem Tan'dan izinle alınmalı (`books.json` içindeki `coverRemote`
alanları yalnızca künye referansıdır, sitede kullanılmaz).

Önerilen: WebP, en az 600 piksel genişlik, oran yaklaşık 1:1,48.
