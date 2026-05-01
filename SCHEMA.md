# 📋 Pack Schema Reference

Complete specification for `pack.json`. All fields marked **Required** must be present to pass validation.

---

## Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Unique identifier. Lowercase, hyphens only. Example: `shadowfell-expansion` |
| `name` | string | ✅ | Display name shown in Marketplace |
| `version` | string | ✅ | SemVer string. Example: `1.0.0` |
| `author` | string | ✅ | Your name or GitHub handle |
| `description` | string | ✅ | Short description (max 200 chars) |
| `type` | string | ✅ | One of: `dungeon`, `class`, `skin`, `mega` |
| `game_version` | string | ✅ | Min game version. Example: `>=1.0.0` |
| `icon` | string | ✅ | Single emoji used as pack icon |
| `banner` | string | — | Filename of banner image (800×200px recommended) |
| `tags` | string[] | — | Searchable tags. Use `difficulty:easy/normal/hard/brutal` |
| `hasAdvancedScripts` | boolean | auto | Set automatically by the engine. Do not set manually. |
| `enemies` | Enemy[] | — | Array of enemy definitions |
| `classes` | Class[] | — | Array of class definitions |
| `weapons` | Weapon[] | — | Array of weapon tile overrides |
| `hazards` | Hazard[] | — | Array of hazard definitions |
| `artifacts` | Artifact[] | — | Array of artifact definitions |
| `skin` | Skin | — | Visual theme object |

---

## Enemy Definition

### Simple Mode

```json
{
  "id": "shadow_wraith",
  "name": "Shadow Wraith",
  "icon": "👻",
  "hp": 4500,
  "slides": 38,
  "lore": "A spirit consumed by darkness.",
  "mode": "simple",
  "primaryAbility": {
    "name": "Phase Shift",
    "trigger": "every_n_slides",
    "triggerParam": 9,
    "effect": "spawn_hazard",
    "effectParam": "curse",
    "logMessage": "Phase Shift: A curse tile appeared!"
  },
  "passiveAbility": {
    "name": "Ethereal",
    "effect": "damage_reduction",
    "effectParam": 15,
    "logMessage": "The Wraith resists ${amount} damage..."
  },
  "deathReward": {
    "goldBonus": 35,
    "logMessage": "+35 gold found in the mist."
  }
}
```

### Advanced Mode

```json
{
  "id": "rift_caller",
  "name": "The Rift Caller",
  "icon": "🌀",
  "hp": 18000,
  "slides": 42,
  "lore": "Born from collapsed dimensional rifts.",
  "mode": "advanced",
  "script": {
    "onSlide": "if (G.slides % 6 === 0) { G.spawnHazard('curse'); G.log('Rift pulses!'); }",
    "onDamage": "if (dmg > 2000) { G.player.drainSlides(2); G.log('Rift deflects!'); }",
    "onDeath": "G.player.addGold(50); G.log('+50 gold salvaged.');"
  }
}
```

### Enemy Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | Unique within pack |
| `name` | string | ✅ | |
| `icon` | string | ✅ | Single emoji |
| `hp` | number | ✅ | |
| `slides` | number | ✅ | Starting slides for this encounter |
| `lore` | string | — | Shown on enemy card |
| `mode` | string | ✅ | `"simple"` or `"advanced"` |
| `primaryAbility` | Ability | Simple only | Active ability |
| `passiveAbility` | Ability | Simple only | Always-on passive |
| `deathReward` | DeathReward | — | Gold + log on defeat |
| `script` | Script | Advanced only | `onSlide`, `onDamage`, `onDeath` handlers |

---

## Trigger Types (Simple Mode)

| Trigger | triggerParam | Description |
|---|---|---|
| `every_n_slides` | integer | Fires every N slides |
| `on_damage` | number (threshold) | Fires when player deals > N damage |
| `on_hp_below` | number (0–100 %) | Fires when enemy HP < X% |
| `on_slide_start` | — | Every slide, before effects |
| `on_weapon_merge` | tile value (2,4,8…) | Fires when that weapon tier merges |

---

## Effect Types (Simple Mode)

| Effect | effectParam | Description |
|---|---|---|
| `spawn_hazard` | hazard id string | Spawns a hazard tile on the grid |
| `regen` | number | Heals enemy by N HP per trigger |
| `damage_reduction` | number (0–100 %) | Reduces all damage taken by N% |
| `tile_shuffle` | integer | Shuffles N random tiles |
| `weapon_degrade` | `"best"` / `"worst"` | Halves the specified weapon tile |
| `weapon_destroy` | `"best"` / `"worst"` | Removes the specified weapon tile |
| `drain_slides` | integer | Removes N slides from player |
| `drain_gold` | integer | Steals N gold from player |
| `crit_immune` | — | Crits deal no bonus for this encounter |
| `spell_cost_up` | number (multiplier) | Multiply spell costs by this value |
| `custom_spawn` | hazard id from this pack | Spawns a custom hazard defined in this pack |

Built-in hazard IDs: `slime`, `goblin`, `skeleton`, `mimic`, `web`, `curse`, `spore`

---

## Class Definition

### Simple Mode

```json
{
  "id": "shadow_knight",
  "name": "Shadow Knight",
  "icon": "🗡️",
  "desc": "Crits restore 2 slides. Spell: Death Coil.",
  "lore": "A warrior who made a pact with death itself.",
  "d20Mod": 0,
  "mode": "simple",
  "passiveTrigger": "on_crit",
  "passiveEffect": "restore_slides",
  "passiveParam": 2,
  "ability": {
    "name": "Death Coil",
    "spellType": "death_coil",
    "count": 1,
    "sides": 10,
    "maxUses": 2,
    "mode": "simple",
    "simpleEffect": "deal_damage",
    "simpleParam": "multiplier_x200",
    "description": "Deals multiplier × 200 damage."
  }
}
```

### Advanced Mode Spell

```json
{
  "ability": {
    "name": "Rift Strike",
    "mode": "advanced",
    "maxUses": 2,
    "script": {
      "onCast": "let dmg = G.player.multiplier * 350; G.enemy.dealDamage(dmg); G.log('Rift Strike! ' + Math.floor(dmg) + ' dealt.');"
    }
  }
}
```

### Class Passive Triggers

| Trigger | Description |
|---|---|
| `on_crit` | D20 roll is a natural 20 |
| `on_merge` | Any weapon tile merges |
| `on_merge_t1` | Tier-1 tile (value 4) merges |
| `on_merge_t3` | Tier-3+ tile (value 8+) merges |
| `on_slide` | Every slide |
| `on_gold_earn` | Any gold is earned |
| `on_spell_cast` | Any spell is cast |

### Class Passive Effects

| Effect | Param | Description |
|---|---|---|
| `restore_slides` | integer | Add N slides |
| `add_gold` | integer | Add N gold |
| `add_multiplier` | float | Add N to multiplier |
| `add_d20_mod` | integer | Temporarily add N to next D20 roll |
| `deal_damage` | integer | Deal N direct damage |

---

## Weapon Override

```json
{
  "tileValue": 2,
  "name": "Shadow Shard",
  "icon": "🌑",
  "bg": "#1a0030",
  "text": "#e0aaff",
  "dmg": 2
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `tileValue` | number | ✅ | Must be a valid tile value: 2, 4, 8, 16, 32, 64, 128, 256, 512+ |
| `name` | string | ✅ | |
| `icon` | string | ✅ | Single emoji |
| `bg` | string | ✅ | CSS color value for tile background |
| `text` | string | ✅ | CSS color value for tile text |
| `dmg` | number | ✅ | Base damage value |

---

## Hazard Definition

```json
{
  "id": "void_tear",
  "name": "Void Tear",
  "icon": "🕳️",
  "bg": "#0d0015",
  "text": "#ffffff",
  "tileValue": -8,
  "effect": "drain_slides",
  "effectParam": 1,
  "clearThreshold": 100
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | Used in enemy spawn effects |
| `name` | string | ✅ | |
| `icon` | string | ✅ | |
| `bg` | string | ✅ | |
| `text` | string | ✅ | |
| `tileValue` | number | ✅ | Must be negative, must not clash with built-ins (-1 to -7) |
| `effect` | string | — | `drain_slides`, `drain_gold`, `steal_weapon`, `block_merge` |
| `effectParam` | any | — | Param for the effect |
| `clearThreshold` | number | — | Min damage in one turn to auto-clear this hazard |

---

## Artifact Definition

```json
{
  "id": "VOID_LENS",
  "name": "Void Lens",
  "icon": "🔭",
  "rarity": "Epic",
  "classReq": null,
  "basePrice": 25,
  "desc": "Each slide in the dark counts double.",
  "mode": "simple",
  "passiveTrigger": "on_slide",
  "passiveEffect": "add_multiplier",
  "passiveParam": 0.05
}
```

Rarity values: `Common`, `Rare`, `Epic`, `Legendary`, `Artifact`

---

## Skin Definition

```json
{
  "skin": {
    "themeName": "Gothic Shadowfell",
    "cssVars": {
      "--color-primary": "#8b5cf6",
      "--color-accent": "#4c1d95",
      "--bg-body": "#0d0015",
      "--tile-border-radius": "4px",
      "--font-display": "Cinzel Decorative"
    },
    "fontFamily": "Cinzel Decorative",
    "fontUrl": "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap",
    "logoOverride": "🌑 DARK 2048"
  }
}
```

### Available CSS Variables

| Variable | Default | Description |
|---|---|---|
| `--color-primary` | `#f43f5e` | Primary accent color (buttons, highlights) |
| `--color-accent` | `#e11d48` | Secondary accent |
| `--bg-body` | `#020617` | Page background |
| `--bg-surface` | `#0f172a` | Card / surface background |
| `--bg-border` | `#1e293b` | Border color |
| `--tile-border-radius` | `1rem` | Tile corner radius |
| `--font-display` | `serif` | Font for titles and headings |
| `--font-body` | `sans-serif` | Font for body text |

---

## Script Event Reference (Advanced Mode)

Each advanced enemy/class/ability can define these script hooks:

| Hook | Available on | Args | Description |
|---|---|---|---|
| `onSlide` | Enemy, Artifact | `G` | Called after every player slide |
| `onDamage` | Enemy | `G, dmg` | Called after player deals damage |
| `onDeath` | Enemy | `G` | Called when enemy HP reaches 0 |
| `onCast` | Ability | `G` | Called when class ability is activated |
| `onPassive` | Class | `G` | Called when passive trigger fires |
| `onEncounterStart` | Enemy | `G` | Called at start of encounter |

---

*See [CONTRIBUTING.md](./CONTRIBUTING.md) for submission instructions.*
