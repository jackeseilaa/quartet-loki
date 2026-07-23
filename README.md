# Quartet Loki

Purjeveneen **s/y Quartet** lokikirja- ja matkapäiväkirjasovellus (J Sailing Tmi).

- Kirjaa matkat, polttoainelogin ja lokimerkinnät GPS-sijainnin perusteella (Firestore-kokoelmat `quartet_journeys`, `quartet_settings`, `quartet_fuel_log`).
- Hakee automaattisesti purjehdussään useasta lähteestä (Open-Meteo + Windy Point Forecast API) sekä lomakkeen että GPS-toimintojen ("Aloita matka", "Lokimerkintä") yhteydessä, ja käsittelee tilanteet joissa yhteyttä säädataan ei saada.
- Auth: Firebase Auth (Google), rajattu osoitteeseen `jacke.seilaa@gmail.com`. Sama `jsailing-f716c`-Firebase-projekti kuin muissa J Sailing -sovelluksissa.
- `firestore.rules` määrittää Firestore-tietokannan käyttöoikeudet (yksi sallittu sähköposti per kokoelma). ✅ **Tarkistettu 23.7.2026**: tunnistautumaton REST-pyyntö kaikkiin kolmeen kokoelmaan palautti `403 PERMISSION_DENIED` — data on suojattu.
- Julkaistaan GitHub Pagesiin `.github/workflows/static.yml`-workflow'n kautta. ✅ Deploy ajan tasalla — live vastaa HEAD:iä (v3000.20).

⚠️ **Huom — kovakoodattu API-avain**: `index.html` sisältää kiinteän Windy.com Point Forecast -API-avaimen (`DEFAULT_WINDY_KEY`) suoraan lähdekoodissa, joka on julkisesti nähtävissä sekä repossa että deployatussa sivussa. Kuka tahansa voi kaapia avaimen ja käyttää sitä omilla pyynnöillään, mikä voi kuluttaa käyttökiintiötä tai aiheuttaa kustannuksia tilin Windy-tilille. Suositus: kierrätä avain Windyn hallintapaneelista ja harkitse sen siirtämistä palvelinpuolen proxyn (esim. Cloud Function) taakse, tai ainakin rajoita avain domain-kohtaisesti Windyn asetuksista jos se on mahdollista.

Live: https://jackeseilaa.github.io/quartet-loki/
