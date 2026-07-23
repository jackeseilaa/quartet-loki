# Quartet Loki

Purjeveneen **s/y Quartet** lokikirja- ja matkapäiväkirjasovellus (J Sailing Tmi).

- Kirjaa matkat ja lokimerkinnät GPS-sijainnin perusteella.
- Hakee automaattisesti purjehdussään useasta lähteestä (ICON-D2/ECMWF-tyyppiset palvelut) sekä lomakkeen että GPS-toimintojen ("Aloita matka", "Lokimerkintä") yhteydessä, ja käsittelee tilanteet joissa yhteyttä säädataan ei saada.
- `firestore.rules` määrittää Firestore-tietokannan käyttöoikeudet.
- Julkaistaan GitHub Pagesiin `.github/workflows/static.yml`-workflow'n kautta.

Live: https://jackeseilaa.github.io/quartet-loki/
