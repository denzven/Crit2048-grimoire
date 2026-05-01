# 📜 Crit 2048 Grimoire

> **The official community content registry for [Crit 2048](https://github.com/denzven/Crit2048_scale).**
> Browse, install, and share Content Packs directly from inside the game's built-in **Marketplace**.

---

## What is the Grimoire?

The Grimoire is the central registry for all community-made **Content Packs** for Crit 2048 — a roguelike D&D 2048 game.

Content Packs let you:
- 🐉 **Add custom enemies and bosses** with unique abilities and triggers
- 🧙 **Create new playable classes** with custom spells and passives
- ⚔️ **Reskin weapons and tiles** with new names, icons, and colors
- 🎨 **Apply full visual themes** (colors, fonts, UI style)
- 🌀 **Script advanced mechanics** using a safe, sandboxed GameAPI

Packs are installed in-game through **The Grimoire** tab (no manual file management needed).

---

## Pack Types

| Type | Tag | Contents |
|---|---|---|
| **Dungeon Pack** | `dungeon` | Enemies, bosses, hazards |
| **Class Pack** | `class` | New playable classes + spells |
| **Skin Pack** | `skin` | Visual theme, colors, fonts, tile names |
| **Mega Pack** | `mega` | All of the above combined |

---

## ⚠️ Advanced Scripting Packs

Some packs use **Advanced Scripting** — custom JavaScript logic executed in a sandboxed environment. These are flagged with the `⚠️ ADVANCED` badge in the Marketplace.

Advanced packs can dramatically change gameplay. **Only install packs from authors you trust.**

The sandbox blocks all access to `window`, `document`, `fetch`, and browser APIs. Scripts only interact with the game through the whitelisted `GameAPI (G)`.

---

## Installing Packs

1. Open **Crit 2048**
2. Press the **📜 Grimoire** button in the header
3. Browse by category or search
4. Click **Install** — that's it!

Installed packs are stored locally and work fully **offline**.

---

## Submitting Your Pack

Want your pack featured here? Follow these steps:

### 1. Create your pack in The Forge

Use the in-game **⚒️ Forge** to design your pack:
- **Simple Mode** — Visual form wizard, no code required
- **Advanced Mode** — Full GameAPI scripting for complex mechanics

Export your pack using the **Export** button. You'll get a `pack.json` file (and optionally a `banner.png`).

### 2. Fork this repo

```bash
git clone https://github.com/denzven/crit2048-grimoire.git
cd crit2048-grimoire
```

### 3. Add your pack folder

```
packs/
└── your-pack-id/
    ├── pack.json        ← Required. Must pass validation.
    ├── banner.png       ← Recommended. 800×200px, shown in Marketplace.
    └── preview.png      ← Optional. 400×400px, thumbnail.
```

> **Pack ID rules:** lowercase, hyphens only, no spaces. Example: `dragon-reborn`, `arcane-surge`.

### 4. Run the validator locally

```bash
node tools/validate.js packs/your-pack-id/pack.json
```

All errors must be fixed before submitting.

### 5. Open a Pull Request

Use the provided PR template. Fill in all fields. PRs that fail the automated CI validation will not be merged.

---

## Pack Schema Reference

See **[SCHEMA.md](./SCHEMA.md)** for the full `pack.json` specification, including all available effect types, trigger types, and GameAPI methods.

---

## File Structure

```
crit2048-grimoire/
├── README.md                     ← You are here
├── CONTRIBUTING.md               ← Detailed submission guide
├── SCHEMA.md                     ← Full pack.json schema reference
├── registry.json                 ← Marketplace index (auto-read by the game)
├── packs/
│   ├── default/                  ← Built-in game data (reference, not installed)
│   │   └── pack.json
│   ├── .template/                ← Starter template for your pack
│   │   ├── pack.json
│   │   └── README.md
│   └── [community-packs]/        ← One folder per pack
│       ├── pack.json
│       ├── banner.png
│       └── preview.png
├── tools/
│   └── validate.js               ← Node.js validator
└── .github/
    ├── workflows/
    │   └── validate-packs.yml    ← CI: validates all packs on PR
    └── PULL_REQUEST_TEMPLATE.md  ← PR checklist
```

---

## GameAPI Reference (Advanced Packs)

Available inside all `"mode": "advanced"` script blocks:

```
G.slides                    Current slide count in encounter
G.enemy.hp                  Enemy current HP (read)
G.enemy.maxHp               Enemy max HP (read)
G.enemy.healHp(n)           Restore n HP to enemy
G.enemy.dealDamage(n)       Deal n damage to enemy (bypasses multiplier)
G.player.gold               Player gold (read)
G.player.addGold(n)         Give player n gold
G.player.drainSlides(n)     Reduce slides left by n
G.player.multiplier         Current damage multiplier (read)
G.player.addMultiplier(n)   Add n to multiplier
G.player.classId            Player class string (read)
G.spawnHazard(id)           Spawn hazard tile by id (e.g. 'curse', 'slime')
G.grid                      Read-only tile snapshot: [{val: number}]
G.log(msg)                  Add message to combat log
G.shuffleTiles(n)           Shuffle n random non-null tiles
G.degradeWeapon(selector)   Halve a weapon: "best" | "worst"
G.destroyWeapon(selector)   Remove a weapon: "best" | "worst"
G.prng()                    Seeded random number 0–1 (deterministic)
```

**Blocked:** `window`, `document`, `fetch`, `XMLHttpRequest`, `import`, `eval`, `Function`, `__TAURI__`

---

## Community & Support

- 🐛 **Bug in a pack?** Open an issue and tag the pack author
- 💡 **Feature request for the GameAPI?** Open an issue with the `enhancement` label
- 💬 **Questions?** Check the [Crit 2048 main repo](https://github.com/denzven/Crit2048_scale)

---

*Maintained by [@denzven](https://github.com/denzven) · Licensed under MIT*
