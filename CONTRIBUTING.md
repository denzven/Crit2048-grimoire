# 🤝 Contributing to the Crit 2048 Grimoire

Thank you for creating content for Crit 2048! This guide walks you through submitting your pack to the community registry.

---

## Before You Start

- Create and test your pack in the in-game **⚒️ Forge** first
- Read the [Schema Reference](./SCHEMA.md) to understand all available options
- Ensure your pack ID is unique — search `registry.json` before choosing

---

## Pack ID Rules

- Lowercase letters, numbers, and hyphens only
- No spaces or special characters
- Must be globally unique in the registry
- Examples: ✅ `dragon-reborn` ✅ `arcane-surge-v2` ❌ `My Pack` ❌ `pack_123`

---

## Submission Steps

### Step 1 — Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/crit2048-grimoire.git
cd crit2048-grimoire
```

### Step 2 — Create your pack folder

```bash
mkdir packs/your-pack-id
```

Required files:
```
packs/your-pack-id/
├── pack.json       ← Required
├── banner.png      ← Strongly recommended (800×200px)
└── preview.png     ← Optional (400×400px)
```

You can use `packs/.template/pack.json` as a starting point.

### Step 3 — Validate your pack

```bash
node tools/validate.js packs/your-pack-id/pack.json
```

Fix all errors before continuing. Warnings are informational.

### Step 4 — Open a Pull Request

Push your branch and open a PR. Use the PR template — fill in every checkbox.

The CI pipeline will automatically validate your `pack.json`. PRs with failing validation **will not be merged**.

---

## Content Guidelines

✅ **Allowed:**
- Custom enemies, classes, weapons, hazards, artifacts, skins
- Advanced scripting using the documented GameAPI
- Lore text and custom log messages
- External font URLs (Google Fonts only)

❌ **Not allowed:**
- Scripts that attempt to access `window`, `document`, `fetch`, or browser APIs
- Packs that intentionally crash or corrupt game state
- Plagiarised content from other games or packs without permission
- Offensive, hateful, or NSFW content of any kind
- External image URLs (all images must be bundled in the pack folder)

---

## Updating Your Pack

To update an existing pack:
1. Bump the `version` field in `pack.json` (e.g. `1.0.0` → `1.1.0`)
2. Open a new PR with the updated files
3. The maintainer updates `registry.json` with the new version

---

## Advanced Packs

If your pack uses `"mode": "advanced"` anywhere, it will be automatically flagged with `⚠️ ADVANCED SCRIPTING` in the Marketplace. This is expected and correct behaviour — do not try to suppress it.

Players installing Advanced packs see a warning dialog explaining the implications. This is a feature, not a bug.

---

## Questions?

Open an issue with the `question` label. We're happy to help!
