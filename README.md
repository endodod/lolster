# Lolster

An imposter party game with League of Legends or Deadlock words. Everyone gets the same word, except the imposter. Give clues, vote, and if the imposter is caught they get one guess at the word to steal the win.

- **Pass & play**: one phone passed around the table (no network needed).
- **Online**: create a lobby, share the 4-letter code or link, play from your own devices. Clues can be typed in turns or spoken (voice / same room).
- **Discreet mode** (online, per device): hold-to-peek cards and identical card colours for every role, for players sitting next to each other on laptops. Press `C` to cover the screen.
- No accounts, no database: each lobby lives in memory in its own Durable Object and disappears when everyone leaves.

## Balancing

Speaking first is the hardest seat for an imposter, so the first speaker gets one notch sharper hint:

| Setting "Imposter sees category" | Normal imposter | Imposter speaking first |
| --- | --- | --- |
| Off | nothing | category |
| On | category | category › subcategory (e.g. Champions › Support) |

Subcategories smaller than 5 words are never used as a hint (`MIN_SUB_SIZE` in `src/shared/words.ts`).

## Scoring

- Crew catch the imposter and the imposter misses the word: every crew member +1, +2 if they voted for the imposter.
- Imposter caught but guesses the word: that imposter +2, other imposters +1.
- Imposter escapes (wrong person voted out, tie, or skip): each imposter +2.

## Develop

```bash
npm install
npm run dev        # Vite on :5173 + lobby server (wrangler dev) on :1999
```

## Deploy

The lobby server is a [PartyServer](https://github.com/cloudflare/partykit/tree/main/packages/partyserver) Durable Object on Cloudflare Workers (hosted PartyKit shut down in Oct 2026; PartyServer is its successor and uses the same `partysocket` client).

1. Lobby server: `CLOUDFLARE_API_TOKEN=... npm run deploy:party` (token from the "Edit Cloudflare Workers" template). Live at `lolster-party.lolster.workers.dev`.
2. Web app on Vercel: env `VITE_PARTYKIT_HOST=lolster-party.lolster.workers.dev`, framework Vite, output `dist`.

## Layout

- `party/server.ts`: lobby + game state machine (PartyServer Durable Object).
- `src/shared/`: word pools and message types shared by client and server.
- `src/local.tsx`: pass & play. `src/online.tsx`: online lobby and rounds. `src/ui.tsx`: shared components.

Fan-made. Not endorsed by Riot Games or Valve.
