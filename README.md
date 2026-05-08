# ÖV Abfahrten Schweiz

Echtzeit-Abfahrtsanzeige für alle Schweizer ÖV-Haltestellen — inspiriert von Tramli.

## Features

- 🔍 **Stationssuche** mit Live-Autocomplete (alle CH Haltestellen)
- ⏱ **Echtzeit-Abfahrten** — automatische Aktualisierung alle 30 Sekunden
- ⭐ **Favoriten** mit direktem Link pro Station (z.B. `/station/8503000`)
- 🌙 **Dunkles Theme** im Stil echter Abfahrtstafeln
- 📱 **Mobile-optimiert** und vollständig responsive
- 🚀 **Vercel-ready** — Zero-Config Deployment

## Datenquelle

Die App nutzt die kostenlose, öffentliche API von **transport.opendata.ch** — kein API-Key nötig.  
Deckt alle SBB, ZVV, BLS, und weitere CH-ÖV-Verbindungen ab.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## Deployment auf Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Code auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) einloggen
3. "New Project" → GitHub Repo auswählen
4. Framework: **Next.js** (wird automatisch erkannt)
5. Deploy klicken — fertig!

Keine Environment Variables nötig.

## Direkte Stations-Links

Jede Station hat eine eigene URL die du bookmarken oder teilen kannst:
```
https://deine-domain.vercel.app/station/8503000  ← Zürich HB
https://deine-domain.vercel.app/station/8507000  ← Bern
https://deine-domain.vercel.app/station/8500010  ← Basel SBB
```

Die IDs kommen automatisch aus der Suche.

## Upgrade: Offizielle SBB API

Für mehr Zuverlässigkeit und mehr Daten kannst du auf die offizielle  
**opentransportdata.swiss** API upgraden:
1. Kostenlosen Account erstellen auf opentransportdata.swiss
2. API-Key beantragen
3. `/lib/api.ts` anpassen → neuer Endpoint

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **transport.opendata.ch** REST API
- Fonts: Bebas Neue + Share Tech Mono + DM Sans
