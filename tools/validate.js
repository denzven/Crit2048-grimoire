#!/usr/bin/env node
/**
 * Crit 2048 Grimoire — Pack Validator
 * Usage: node tools/validate.js packs/your-pack-id/pack.json
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_TOP = ['id', 'name', 'version', 'author', 'description', 'type', 'game_version', 'icon'];
const VALID_TYPES = ['dungeon', 'class', 'skin', 'mega'];
const VALID_EFFECTS = ['spawn_hazard','regen','damage_reduction','tile_shuffle','weapon_degrade','weapon_destroy','drain_slides','drain_gold','crit_immune','spell_cost_up','custom_spawn'];
const VALID_TRIGGERS = ['every_n_slides','on_damage','on_hp_below','on_slide_start','on_weapon_merge'];
const BLOCKED_KEYWORDS = ['window.','document.','fetch(','XMLHttpRequest','import(','eval(','Function(','__TAURI__'];
const BUILTIN_HAZARD_VALUES = [-1,-2,-3,-4,-5,-6,-7];

const errors = [];
const warnings = [];

function error(msg) { errors.push(`❌ ${msg}`); }
function warn(msg)  { warnings.push(`⚠️  ${msg}`); }
function ok(msg)    { console.log(`✅ ${msg}`); }

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node tools/validate.js packs/<id>/pack.json');
  process.exit(1);
}

let pack;
try {
  const raw = fs.readFileSync(filePath, 'utf8');
  pack = JSON.parse(raw);
} catch (e) {
  console.error(`❌ Failed to parse JSON: ${e.message}`);
  process.exit(1);
}

// --- Top-level required fields ---
REQUIRED_TOP.forEach(f => {
  if (!pack[f]) error(`Missing required field: "${f}"`);
});

// --- ID format ---
if (pack.id && !/^[a-z0-9-]+$/.test(pack.id)) {
  error(`"id" must be lowercase letters, numbers, and hyphens only. Got: "${pack.id}"`);
}

// --- Type ---
if (pack.type && !VALID_TYPES.includes(pack.type)) {
  error(`"type" must be one of: ${VALID_TYPES.join(', ')}. Got: "${pack.type}"`);
}

// --- Version semver ---
if (pack.version && !/^\d+\.\d+\.\d+$/.test(pack.version)) {
  warn(`"version" should follow semver (e.g. 1.0.0). Got: "${pack.version}"`);
}

// --- Description length ---
if (pack.description && pack.description.length > 200) {
  warn(`"description" exceeds 200 characters (${pack.description.length} chars). Consider trimming.`);
}

// --- hasAdvancedScripts check (cannot be false if scripts exist) ---
let detectedAdvanced = false;

function checkAdvancedScript(scriptObj, context) {
  if (!scriptObj) return;
  Object.values(scriptObj).forEach(scriptStr => {
    detectedAdvanced = true;
    BLOCKED_KEYWORDS.forEach(kw => {
      if (scriptStr.includes(kw)) {
        error(`[${context}] Script contains blocked keyword: "${kw}"`);
      }
    });
  });
}

// --- Enemies ---
if (Array.isArray(pack.enemies)) {
  const ids = new Set();
  pack.enemies.forEach((enemy, i) => {
    const ctx = `enemy[${i}] "${enemy.name || '?'}"`;
    if (!enemy.id) error(`${ctx}: Missing "id"`);
    if (!enemy.name) error(`${ctx}: Missing "name"`);
    if (!enemy.icon) error(`${ctx}: Missing "icon"`);
    if (!enemy.hp || enemy.hp <= 0) error(`${ctx}: "hp" must be > 0`);
    if (!enemy.slides || enemy.slides <= 0) error(`${ctx}: "slides" must be > 0`);
    if (!enemy.mode) error(`${ctx}: Missing "mode" (simple | advanced)`);
    
    if (enemy.id && ids.has(enemy.id)) error(`${ctx}: Duplicate enemy id "${enemy.id}"`);
    if (enemy.id) ids.add(enemy.id);

    if (enemy.mode === 'simple') {
      if (enemy.primaryAbility) {
        const ab = enemy.primaryAbility;
        if (!VALID_TRIGGERS.includes(ab.trigger)) warn(`${ctx} primaryAbility: Unknown trigger "${ab.trigger}"`);
        if (!VALID_EFFECTS.includes(ab.effect)) warn(`${ctx} primaryAbility: Unknown effect "${ab.effect}"`);
      }
      if (enemy.passiveAbility) {
        const pa = enemy.passiveAbility;
        if (!VALID_EFFECTS.includes(pa.effect)) warn(`${ctx} passiveAbility: Unknown effect "${pa.effect}"`);
      }
    } else if (enemy.mode === 'advanced') {
      checkAdvancedScript(enemy.script, ctx);
    }
  });
  ok(`Enemies: ${pack.enemies.length} defined`);
}

// --- Classes ---
if (Array.isArray(pack.classes)) {
  const ids = new Set();
  pack.classes.forEach((cls, i) => {
    const ctx = `class[${i}] "${cls.name || '?'}"`;
    if (!cls.id) error(`${ctx}: Missing "id"`);
    if (!cls.name) error(`${ctx}: Missing "name"`);
    if (!cls.icon) error(`${ctx}: Missing "icon"`);
    if (!cls.desc) error(`${ctx}: Missing "desc"`);
    if (cls.id && ids.has(cls.id)) error(`${ctx}: Duplicate class id "${cls.id}"`);
    if (cls.id) ids.add(cls.id);
    if (cls.ability && cls.ability.mode === 'advanced') {
      checkAdvancedScript(cls.ability.script, `${ctx} ability`);
    }
  });
  ok(`Classes: ${pack.classes.length} defined`);
}

// --- Hazards ---
if (Array.isArray(pack.hazards)) {
  pack.hazards.forEach((hz, i) => {
    const ctx = `hazard[${i}] "${hz.name || '?'}"`;
    if (!hz.id) error(`${ctx}: Missing "id"`);
    if (!hz.tileValue) error(`${ctx}: Missing "tileValue"`);
    if (hz.tileValue >= 0) error(`${ctx}: "tileValue" must be negative`);
    if (BUILTIN_HAZARD_VALUES.includes(hz.tileValue)) {
      error(`${ctx}: "tileValue" ${hz.tileValue} conflicts with a built-in hazard. Use -8 or lower.`);
    }
  });
  ok(`Hazards: ${pack.hazards.length} defined`);
}

// --- Advanced flag consistency ---
if (detectedAdvanced && pack.hasAdvancedScripts === false) {
  error(`Pack contains advanced scripts but "hasAdvancedScripts" is false. The engine will auto-correct this, but please set it to true in the pack file.`);
}
if (!detectedAdvanced && pack.hasAdvancedScripts === true) {
  warn(`"hasAdvancedScripts" is true but no advanced scripts were found. This will show an unnecessary warning to users.`);
}

// --- Summary ---
console.log('\n--- Validation Result ---');
if (warnings.length > 0) warnings.forEach(w => console.log(w));
if (errors.length > 0) {
  errors.forEach(e => console.log(e));
  console.log(`\n🔴 Validation FAILED (${errors.length} error(s), ${warnings.length} warning(s))`);
  process.exit(1);
} else {
  console.log(`\n🟢 Validation PASSED (${warnings.length} warning(s))`);
  process.exit(0);
}
