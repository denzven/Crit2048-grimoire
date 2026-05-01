# 📋 Pack Schema — Full Specification

Complete reference for `pack.json`. Fields marked **Required** must be present to pass validation.

---

## Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Unique identifier. Lowercase + hyphens only. E.g. `shadowfell-expansion` |
| `name` | string | ✅ | Display name shown in Marketplace |
| `version` | string | ✅ | SemVer. E.g. `1.0.0` |
| `author` | string | ✅ | Your name or GitHub handle |
| `description` | string | ✅ | Short description (max 200 chars) |
| `type` | string | ✅ | `dungeon` \| `class` \| `skin` \| `mega` |
| `game_version` | string | ✅ | Min game version. E.g. `>=1.0.0` |
| `icon` | string | ✅ | Single emoji pack icon |
| `banner` | string | — | Banner image filename (800×200px) |
| `tags` | string[] | — | Searchable tags. Use `difficulty:easy/normal/hard/brutal` |
| `hasAdvancedScripts` | boolean | auto | Auto-set by engine scan. Do not set manually. |
| `enemies` | Enemy[] | — | Enemy definitions |
| `classes` | Class[] | — | Class definitions |
| `weapons` | Weapon[] | — | Weapon tile overrides |
| `hazards` | Hazard[] | — | Hazard tile definitions |
| `artifacts` | Artifact[] | — | Artifact definitions |
| `skin` | Skin | — | Visual theme object |

---

## Enemy

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
  "deathReward": { "goldBonus": 35, "logMessage": "+35 gold found in the mist." }
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
  "mode": "advanced",
  "script": {
    "onSlide": "if (G.slides % 6 === 0) { G.spawnHazard('curse'); G.log('Rift pulses!'); }",
    "onDamage": "if (dmg > 2000) { G.player.drainSlides(2); G.log('Rift deflects the blow!'); }",
    "onDeath": "G.player.addGold(50); G.log('The rift collapses. +50 gold.');"
  }
}
```

### Triggers (Simple Mode)
| Trigger | triggerParam | Fires when... |
|---|---|---|
| `every_n_slides` | integer | Every N slides |
| `on_damage` | number | Player deals > N damage |
| `on_hp_below` | 0–100 | Enemy HP < X% |
| `on_slide_start` | — | Every slide |
| `on_weapon_merge` | tile value | Weapon of that value merges |

### Effects (Simple Mode)
| Effect | effectParam | Description |
|---|---|---|
| `spawn_hazard` | hazard id | Spawn a hazard tile |
| `regen` | hp amount | Heal enemy per trigger |
| `damage_reduction` | 0–100 % | Reduce all damage taken |
| `tile_shuffle` | integer | Shuffle N random tiles |
| `weapon_degrade` | `"best"` / `"worst"` | Halve a weapon tile |
| `weapon_destroy` | `"best"` / `"worst"` | Remove a weapon tile |
| `drain_slides` | integer | Remove N slides from player |
| `drain_gold` | integer | Steal N gold from player |
| `crit_immune` | — | Crits deal no bonus |
| `spell_cost_up` | multiplier | Multiply spell costs |
| `custom_spawn` | hazard id from pack | Spawn custom pack hazard |

Built-in hazard ids: `slime`, `goblin`, `skeleton`, `mimic`, `web`, `curse`, `spore`

---

## Class

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
    "count": 1, "sides": 10, "maxUses": 2,
    "mode": "simple",
    "simpleEffect": "deal_damage",
    "simpleParam": "multiplier_x200",
    "description": "Deals multiplier × 200 damage."
  }
}
```

### Advanced Spell
```json
{
  "ability": {
    "name": "Rift Strike", "mode": "advanced", "maxUses": 2,
    "script": {
      "onCast": "let dmg = G.player.multiplier * 350; G.enemy.dealDamage(dmg); G.log('Rift Strike! ' + Math.floor(dmg) + ' dealt.');"
    }
  }
}
```

### Class Passive Triggers
| Trigger | Description |
|---|---|
| `on_crit` | D20 roll is natural 20 |
| `on_merge` | Any weapon merges |
| `on_merge_t3` | Tier-3+ (value ≥ 8) merges |
| `on_slide` | Every slide |
| `on_gold_earn` | Any gold earned |
| `on_spell_cast` | Any spell cast |

### Class Passive Effects
| Effect | Param | Description |
|---|---|---|
| `restore_slides` | integer | Add N slides |
| `add_gold` | integer | Add N gold |
| `add_multiplier` | float | Add N to multiplier |
| `deal_damage` | integer | Deal N direct damage |

---

## Weapon Override
```json
{ "tileValue": 2, "name": "Shadow Shard", "icon": "🌑", "bg": "#1a0030", "text": "#e0aaff", "dmg": 2 }
```
Valid `tileValue`: 2, 4, 8, 16, 32, 64, 128, 256, 512+

---

## Hazard Definition
```json
{
  "id": "void_tear", "name": "Void Tear", "icon": "🕳️",
  "bg": "#0d0015", "text": "#ffffff",
  "tileValue": -8,
  "effect": "drain_slides", "effectParam": 1,
  "clearThreshold": 100
}
```
`tileValue` must be ≤ -8 (built-ins use -1 to -7).

---

## Artifact
```json
{
  "id": "VOID_LENS", "name": "Void Lens", "icon": "🔭",
  "rarity": "Epic", "classReq": null, "basePrice": 25,
  "desc": "Each slide in the dark counts double.",
  "mode": "simple",
  "passiveTrigger": "on_slide",
  "passiveEffect": "add_multiplier",
  "passiveParam": 0.05
}
```
Rarities: `Common`, `Rare`, `Epic`, `Legendary`, `Artifact`

---

## Skin
```json
{
  "skin": {
    "themeName": "Gothic Shadowfell",
    "cssVars": {
      "--pack-primary": "#8b5cf6",
      "--pack-accent": "#4c1d95",
      "--pack-bg": "#0d0015",
      "--pack-tile-radius": "4px"
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
| `--pack-primary` | `#f43f5e` | Primary accent (buttons, highlights) |
| `--pack-accent` | `#e11d48` | Secondary accent |
| `--pack-bg` | `#020617` | Page background |
| `--pack-surface` | `#0f172a` | Card background |
| `--pack-border` | `#1e293b` | Border color |
| `--pack-tile-radius` | `1rem` | Tile corner radius |
| `--pack-font` | `serif` | Display font |

---

## Script Event Hooks (Advanced)
| Hook | Available on | Extra args | Description |
|---|---|---|---|
| `onSlide` | Enemy, Artifact | — | After every player slide |
| `onDamage` | Enemy | `dmg` | After player deals damage |
| `onDeath` | Enemy | — | When enemy HP hits 0 |
| `onCast` | Class Ability | — | When class spell is used |
| `onPassive` | Class | — | When passive trigger fires |
| `onEncounterStart` | Enemy | — | Start of encounter |
