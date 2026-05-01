## Pack Submission Checklist

**Pack ID:** `your-pack-id`
**Pack Name:** Your Pack Name
**Pack Type:** dungeon / class / skin / mega
**Contains Advanced Scripts:** Yes / No

---

### Required Files
- [ ] `packs/your-pack-id/pack.json` is present
- [ ] `pack.json` passes `node tools/validate.js` with no errors
- [ ] Pack ID is unique (not already in `registry.json`)

### Content
- [ ] All IDs unique within the pack
- [ ] Custom hazard `tileValue`s don't clash with built-ins (-1 to -7)
- [ ] No offensive content

### Advanced Scripting (if applicable)
- [ ] Scripts only use documented `G.*` API methods
- [ ] Scripts do not reference `window`, `document`, `fetch`, or `eval`
- [ ] Tested in-game and work correctly

### Images (recommended)
- [ ] `banner.png` (800×200px)
- [ ] `preview.png` (400×400px)
- [ ] Royalty-free or original

### Registry Update
- [ ] Pack entry added to `registry.json`
- [ ] `hasAdvancedScripts` correctly set in `registry.json`

---

### Description
<!-- Describe your pack and what makes it interesting. -->

### Testing Notes
<!-- How did you test? What edge cases did you check? -->
