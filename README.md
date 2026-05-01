# 📜 Crit 2048 Grimoire

> **The official community content registry for [Crit 2048](https://github.com/denzven/Crit2048_scale) — a roguelike D&D 2048 game.**
> Browse, install, and share Content Packs directly from the in-game **Grimoire** marketplace.

---

## What is the Grimoire?

The Grimoire is the central registry for all community-made **Content Packs** for Crit 2048.

Content Packs let you:
- 🐉 **Add custom enemies and bosses** with unique abilities and triggers
- 🧙 **Create new playable classes** with custom spells and passives
- ⚔️ **Reskin weapons and tiles** with new names, icons, and colors
- 🎨 **Apply full visual themes** (colors, fonts, UI style)
- 🌀 **Script advanced mechanics** using a safe, sandboxed GameAPI

Packs are installed in-game through **The Grimoire** tab — no manual file management needed.

---

## Pack Types

| Type | Contents |
|---|---|
| **Dungeon Pack** | Enemies, bosses, hazards |
| **Class Pack** | New playable classes + spells |
| **Skin Pack** | Visual theme, colors, fonts, tile names |
| **Mega Pack** | All of the above combined |

---

## ⚠️ Advanced Scripting Packs

Some packs use **Advanced Scripting** — custom JavaScript logic executed in a sandboxed environment. These are flagged with `⚠️ ADVANCED` in the in-game Marketplace.

Advanced packs can dramatically change gameplay. **Only install packs from authors you trust.**

The sandbox blocks all access to `window`, `document`, `fetch`, and browser APIs. Scripts only interact with the game through a whitelisted `GameAPI (G)` object.

---

## Installing Packs

1. Open **Crit 2048**
2. Press the **📜 Grimoire** button in the header
3. Browse by category or search
4. Click **Install** — packs are stored locally and work fully **offline**

---

## Submitting Your Pack

### 1. Create your pack in The Forge
Use the in-game **⚒️ Forge** to design your pack (Simple form wizard or Advanced JSON scripting). Export with the **Export** button.

### 2. Fork this repo & add your folder
```
packs/
└── your-pack-id/
    ├── pack.json        ← Required. Must pass validation.
    ├── banner.png       ← Recommended. 800×200px.
    └── preview.png      ← Optional. 400×400px thumbnail.
```

**Pack ID rules:** lowercase, hyphens only. Example: `dragon-reborn`, `arcane-surge`.

### 3. Validate locally
```bash
node tools/validate.js packs/your-pack-id/pack.json
```

### 4. Open a Pull Request
Fill in the PR template checklist. The CI pipeline auto-validates on every PR — failures will not be merged.

---

## Repo Structure

```
Crit2048-grimoire/
├── README.md                     ← This file
├── CONTRIBUTING.md               ← Detailed submission guide
├── SCHEMA.md                     ← Full pack.json specification
├── registry.json                 ← Marketplace index (auto-read by the game)
├── packs/
│   ├── default/                  ← Base game data as a reference pack
│   │   └── pack.json
│   ├── .template/                ← Starter template
│   │   ├── pack.json
│   │   └── README.md
│   └── [community-packs]/
│       ├── pack.json
│       ├── banner.png
│       └── preview.png
├── tools/
│   └── validate.js               ← Node.js validator
└── .github/
    ├── workflows/
    │   └── validate-packs.yml    ← CI validation on every PR
    └── PULL_REQUEST_TEMPLATE.md
```

---

## GameAPI Reference (Advanced Packs)

```
G.slides                    Slides elapsed in this encounter (read)
G.enemy.hp                  Enemy current HP (read)
G.enemy.maxHp               Enemy max HP (read)
G.enemy.healHp(n)           Restore n HP to enemy
G.enemy.dealDamage(n)       Deal n damage to enemy (bypasses player multiplier)
G.player.gold               Player gold (read)
G.player.addGold(n)         Give player n gold
G.player.drainSlides(n)     Reduce slides remaining by n
G.player.multiplier         Current damage multiplier (read)
G.player.addMultiplier(n)   Add n to multiplier
G.player.classId            Player class id string (read)
G.spawnHazard(id)           Spawn a hazard tile: 'slime','goblin','skeleton','mimic','web','curse','spore'
G.grid                      Read-only tile snapshot: [{val: number}]
G.log(msg)                  Add a message to the combat log
G.shuffleTiles(n)           Shuffle n random non-null tiles
G.degradeWeapon(selector)   Halve a weapon — "best" | "worst"
G.destroyWeapon(selector)   Remove a weapon — "best" | "worst"
G.prng()                    Seeded random 0–1 (deterministic per run seed)
```

**Blocked keywords (cause install failure):** `window`, `document`, `fetch`, `XMLHttpRequest`, `import(`, `eval(`, `Function(`, `__TAURI__`

---

*Maintained by [@denzven](https://github.com/denzven) · MIT License*
