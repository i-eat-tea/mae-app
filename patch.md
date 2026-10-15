# Mae (ម៉ែ) — Brief 3: One-Page "Read & Dip" Site

**This brief replaces the scope of Briefs 1 and 2.** Aj scrapped the big redesign. Ignore the content schema, review gate, PWA, search tokenizer, CI plan and cutover work from those files. Keep only the rules in §1.

Repo: `i-eat-tea/mae-app`, branch `main`, HEAD at the time of writing: `8f6bcbd` ("Fix: restore style, Khmer, 11 info cards…").
I cloned that commit, ran `npm ci && npm run build`: it builds fine (one 13 KB `index.html`). The earlier failing Vercel log was for commit `a0e365f`, which no longer exists on GitHub (history was rewritten).

---

## 0. What Aj actually wants (in plain words)

> A website with **no login and no database**. One page. It collects **all the information from the original app** (the "initial push"): every information item with its **summary, Khmer and English text, and the source link**. Each item is **tappable** to open more detail, with its **source link shown under it**. The **Khmer/English toggle really switches the language.** There are **no separate "Info" and "My Journey" sections**; it is one list.

Aj said the earlier prompt was unclear, which is why the agent built two sections. This section is the corrected instruction.

---

## 1. Rules (non-negotiable)

1. **Never retype, shorten, translate, paraphrase or "improve" any health text.** All text comes from the original data files by code (§3). Previous attempt rewrote the English summaries into short one-liners and dropped all Khmer text. Do not repeat this.
2. **Never type Khmer by hand into HTML, strings or commands.** That is exactly how the Khmer got corrupted (§2). Khmer comes from the data files, or from the old app's existing UI labels (§5.3). If a Khmer label does not exist, show the English one and leave a `TODO`. Do not machine-translate.
3. **Do not invent content or links.** Every link on the page must be a `sourceUrl` that exists in the original data.
4. **Do not add anything Aj did not ask for** (no accounts, plans, reminders, Telegram prompts, QR, analytics, journey sections, book banners).
5. **Never force-push or rewrite `main`.** Work on a branch, open a pull request, check the Vercel preview, and let Aj merge.
6. **No developer notes on the page.** Text like "Info Tab — 11 Resources (click Source for real links)" and "5 journey elements" must not appear.

---

## 2. What is broken now (verified in the code at `8f6bcbd`)

| # | Symptom Aj sees | Cause found | Where |
|---|---|---|---|
| 1 | **Error characters in Khmer** | The committed file literally contains the Unicode replacement character `U+FFFD` twice: the title `ម៉�` (the vowel sign `ែ` was lost; should be `ម៉ែ`) in the `<h1>` and again in the footer. Also the heading `អ-food` is garbled (should be a proper Khmer word), the toggle label `ភ语言` contains two **Chinese** characters, and the toggle button text `ខ Khmer` has a stray Khmer letter. | `index.html` L2, L3, L5, L9, L26 |
| 2 | **Almost no Khmer on the page** | The whole file has only **30 Khmer characters**. The original `src/data/resources.ts` has **8,220**. None of the 11 original Khmer titles or Khmer summaries appear. | whole page vs `src/data/resources.ts` |
| 3 | **Toggle does nothing** | Both buttons only run `document.documentElement.lang='km'` and change the label text. No content is switched. The buttons are also inverted (the one labelled "English" sets Khmer). | `index.html` L3–L5 |
| 4 | **Cards are not interactive** | Each card is a static `<article>`; the only interaction is a small "Source →" link. There is no way to open more detail. The 11 summaries are agent-written English one-liners, not the originals (the originals also have "why it matters" and a tip). | `index.html` L8–L18 |
| 5 | **Layout split in two** | Two sections ("Info Tab", "My Journey") plus a "Book Link" banner. The 5 "journey" cards (Checkup Prep, Nutrition, Daily Rest, Questions, Support) were **invented**: their text and links (generic home pages like `nmchc.moh.gov.kh/`) are not in the original data. The "Book Link" duplicates the Yellow Book card. | `index.html` L19–L24 |
| 6 | Source links are weak | Good news: all **11 original source URLs are present**. But every link is just "Source →" with no organisation name, 4 cards point to the same English PDF, and the Breastfeeding card links to the PSI home page only (that is what the original data says; do not change it). | `index.html` L8–L18 |
| 7 | Likely visual glitch on Khmer | `letter-spacing:-0.03em` on the Khmer title squeezes stacked Khmer marks. The heading font is Playfair Display (a Latin serif), which has no Khmer glyphs, so Khmer falls back to a random font. | `index.html` `.hero` rule |
| 8 | Repo clutter | The whole old app (68 files: Supabase, Telegram, auth, plans, 12 modals) is back in the repo but unused by the page. `package.json` still has `@supabase/supabase-js`, `@google/genai`, `express`, `dotenv` and is named `react-example`. `supabase/.temp/` (project ref, pooler URL) is committed. | repo root |

---

## 3. Where the information is (source of truth: do not copy by hand)

The original data is intact (no corruption) in these files. **Import them directly from the code. Do not paste their text anywhere.**

| File | Export | Count | Languages | Fields you need | Link source |
|---|---|---|---|---|---|
| `src/data/resources.ts` | `INITIAL_PREGNANCY_RESOURCES` | **11** | Khmer + English | `id`, `titleKh`, `titleEn`, `sourceName` (one mixed Khmer/English string, show as-is), `sourceUrl`, `category`, `pregnancyWeeks`, `summaryKh`, `summaryEn`, `summaryPurpose` (Khmer: why it matters), `weeklyFocus` (Khmer: a tip) | its own `sourceUrl` |
| `src/data/monthlyMessages.ts` | `STAGE_FOCUS_TOPICS` | **3** (one group, keyed `3`, i.e. month 3. My earlier brief said "3 groups of 3"; that was wrong) | Khmer + English | `id`, `titleKh/En`, `category`, `summaryKh/En`, `resourceIds`, `suggestedQuestionsKh/En` | via `resourceIds` → resource `sourceUrl` |
| `src/data/weeklyGuidance.ts` | `CURATED_WEEKLY_GUIDANCE` (weeks 8, 9, 10, 12) | **13 topics** (3, 4, 3, 3) | **English only** | per topic: `id`, `title`, `category`, `summary`, `resourceIds`, `suggestedQuestions` | via `resourceIds` → resource `sourceUrl` |
| `src/data/monthlyMessages.ts` | `MONTHLY_MOM_MESSAGES` | 9 voice-message letters | Khmer + English | audio scripts and letters; **no source links; no audio files exist in the repo** | none |
| `src/data/babySizes.ts` | | | | not information content | |

**Scope decision (default):** the page shows **27 information nodes = 11 resources + 3 focus topics + 13 weekly topics.** The 9 letters/voice scripts and baby sizes are **left out** for now (they have no source link, and the audio does not exist). Aj can change this later.

The weekly topics are English only. **Do not invent Khmer for them.** See §5.4.

Original data files stay exactly as they are. Type definitions they import live in `src/types/index.ts` (`PregnancyResource`, `FocusTopic`, `MonthlyMessage`, `StageGuidance`, `WeeklyGuidance`, `FlowerStage`, `BabySize`); keep that file or move those types next to the data, but do not change the data.

---

## 4. Target page

One page, one list. Mobile first (test at 360 px wide).

```
[ ម៉ែ  Mae  — by FlowErs ]                    [ ខ្មែរ | English ]   ← working toggle
[ search box ]                                   (Khmer placeholder from the old app)
[ All ][ Checkups ][ Nutrition ][ Wellbeing ][ Preparation ][ Basics ]   ← filter chips, NOT sections
┌ node ────────────┐ ┌ node ────────────┐ ┌ node ────────────┐
│ tag   [Week 9]   │ │ …                │ │ …                │
│ Title            │
│ 2-line summary   │
│ [ Read more ▾ ]  │
│ Source: NMCHC ↗  │  ← always visible under the node
└──────────────────┘
footer: disclaimer line (text from Aj), © FlowErs
```

### 4.1 Node (card) anatomy

Collapsed (always visible): category tag, week/month label if any, title, summary clamped to 2 lines, **"Read more" button**, and **under the card: the source link(s)**.

Expanded (tap the title or "Read more"; tap again to collapse; one open at a time is fine):
- full summary (never truncated);
- **Why it matters** = `summaryPurpose` (resources only), **Try this** = `weeklyFocus` (resources only);
- **Questions to ask your health worker** = `suggestedQuestions*` (topics only);
- weeks shown as "All weeks" or "Weeks 8–12" (compute from `pregnancyWeeks`; if all 1–40 then "All weeks");
- the **source block**: organisation name (`sourceName`, as-is), a clear button **"Open source ↗"** (Khmer label from the old app if it exists), a small "PDF" tag when the URL ends in `.pdf`.

Source links for weekly and focus topics: resolve each id in `resourceIds` to that resource's `sourceName` + `sourceUrl`, and show **every** one (usually two) as separate lines. If a topic has no `resourceIds`, show no source line (do not invent one).

Order: the Warning Signs resource (`res-nmchc-warning-signs`) **first, with a clear visual marker** (icon + the words, not only colour). Then the other resources in their original order, then focus topics, then weekly topics by week.

### 4.2 Interaction and accessibility (required)

- The expand control is a real `<button aria-expanded aria-controls>`.
- The source link is a real `<a href target="_blank" rel="noopener noreferrer">`, **placed outside the button** (an `<a>` inside a `<button>` is invalid and breaks keyboard and screen readers).
- Touch targets ≥ 44 × 44 px; visible focus ring; body text ≥ 16 px; Khmer `line-height` ≥ 1.7.
- Do not use `uppercase` or negative `letter-spacing` on Khmer text.
- Fonts: **Kantumruy Pro** for all Khmer and for UI text. Playfair Display only for Latin headings, and only if Aj wants to keep that look. Self-hosting the font is a later improvement, not required now.

### 4.3 Keep the current look

The agent restored the original style (cream `#FAF9F5`, olive `#5C7034` / `#88A04D`, dark `#233125`, rounded white cards). **Keep it.** Only fix what is listed in §2.

---

## 5. Language toggle (must really work)

### 5.1 Behaviour

- Two languages: `km` (default) and `en`. A segmented control with the current language clearly marked (`aria-pressed`). Button labels are fixed names ("ខ្មែរ" and "English"), never swapped.
- Clicking changes **everything on the page**: UI labels, node titles, summaries, tips, questions, filter labels.
- Remember the choice in `localStorage` under the key `mae.lang`. Set `document.documentElement.lang` to match. Wrap `localStorage` access in `try/catch`.

### 5.2 Implementation shape (React, already in the repo)

```ts
type Lang = 'km' | 'en';
const [lang, setLang] = useState<Lang>(() => {
  try { return (localStorage.getItem('mae.lang') as Lang) || 'km'; } catch { return 'km'; }
});
useEffect(() => {
  document.documentElement.lang = lang;
  try { localStorage.setItem('mae.lang', lang); } catch {}
}, [lang]);
```

Every visible string is chosen from data or from one `UI` dictionary: `const text = obj[lang] ?? obj.en`.

### 5.3 UI labels

Take Khmer UI labels (search placeholder, "All", "Read more", "Source", and so on) **from the old app's components** (`src/screens/ResourcesScreen.tsx`, `src/components/ResourceCard.tsx`, `ResourceModal.tsx`). They already exist in Khmer and English. The search placeholder «តើមានអ្វីដែលអ្នកចង់ស្វែងយល់ដែរឬទេ?» is in the old Explore screen. **Read them from the file with code or copy by an editor; do not retype.** If a label is not there, show English and add `// TODO: Khmer label from Aj`.

### 5.4 English-only nodes (the 13 weekly topics)

In Khmer mode, show the English text and a small **"EN"** badge with `aria-label="English only"` (language code, so no translation needed). Collect them in the PR description as "needs Khmer translation by a human". **Do not translate them.**

### 5.5 Category filters (fix the old "Wellbeing shows nothing" bug)

Categories in the data are inconsistent strings. Build an **explicit lookup table** from the exact strings to five slugs, and test it (§7):

| Exact string in data | Slug |
|---|---|
| `ការពិនិត្យសុខភាព (Checkups)`, `Checkups` | `checkups` |
| `អាហារូបត្ថម្ភ (Nutrition)`, `Nutrition` | `nutrition` |
| `ចំណេះដឹងទូទៅអំឡុងពេលមានផ្ទៃពោះ (Pregnancy Basics)` | `basics` |
| `ការថែទាំកាយនិងចិត្ត (Wellbeing)`, `Daily Life & Wellbeing` | `wellbeing` |
| `ការត្រៀមខ្លួនសម្រាលនិងសំណួរ (Preparation & Questions)`, `ការត្រៀមខ្លួនសម្រាល (Preparation for Birth)`, `Preparation & Questions` | `preparation` |

Filter by slug, never with `includes()` on text. Chip labels: take the Khmer part and the English part (inside the parentheses) from the data strings, or the English word for English-only ones.

---

## 6. Tasks (do in this order, one commit each)

Work on branch `fix/read-and-dip`. Run `npm run lint`, `npm run build` and `node scripts/check-text.mjs` before every commit.

**T0 — Safety net.** Tag the current HEAD `before-cleanup`. Create the branch. Never force-push.

**T1 — Add the text-integrity check** (before anything else, so the corruption cannot return). Create `scripts/check-text.mjs`:

```js
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n')
  .filter(f => /\.(html|tsx?|jsx?|json|css|md)$/.test(f) && f !== 'package-lock.json' && !f.startsWith('supabase/'));

const checks = [
  ['U+FFFD replacement character (broken text)', /\uFFFD/g],
  ['Chinese/Japanese ideograph in a Khmer/English project', /[\u4E00-\u9FFF]/g],
  ['Khmer vowel/sign at the start of a word (lost base letter)', /(^|[\s.,;:!?()\-])[\u17B6-\u17D3]/gmu],
];
let bad = 0;
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const [name, re] of checks) {
    const m = s.match(re);
    if (m) { bad++; console.error(`${f}: ${m.length} × ${name}`); }
  }
}
if (bad) process.exit(1);
console.log('text check passed');
```

Add `"check:text": "node scripts/check-text.mjs"` to `package.json` and make `lint` run it. **At this point it must fail on the current `index.html`.** That proves it works. It passes only after T3.
**Done when:** it reports the current `index.html` problems and passes on the original `src/data/*.ts`.

**T2 — Clean the repo.**
- Delete everything not needed: `src/components/*` (old), `src/context/`, `src/screens/`, `src/lib/`, `supabase/`, `metadata.json`, `public/audio/`, and old `src/App.tsx`/`main.tsx` (rewritten in T3).
- Keep `src/data/*.ts` (unchanged), `src/types/index.ts`, `src/index.css` if still useful, `vite.config.ts`, `tsconfig.json`.
- **Before deleting, copy the Khmer UI labels you need** (§5.3) into a small `src/lib/ui.ts` using a script, not by typing.
- `package.json`: rename to `mae-info-hub`; remove `@supabase/supabase-js`, `@google/genai`, `express`, `dotenv`, `motion`, `qrcode`; keep `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`/`@tailwindcss/vite` if used, `lucide-react` if used. Remove the AI Studio comments in `vite.config.ts`.
- `.gitignore`: add `supabase/.temp/` (and remove the folder from git).
**Done when:** `npm ci && npm run build` passes and `npm ls` shows none of the removed packages.

**T3 — Build the page from the data.**
- `index.html` is a **normal short HTML shell** (`<div id="root">` and a script tag to `src/main.tsx`). No inline styles and no long lines.
- `src/lib/nodes.ts` builds the 27 nodes from the three data files (§3) with this shape and resolves `resourceIds` to sources:
  ```ts
  interface L { km?: string; en?: string }
  interface Source { name: string; url: string }
  interface InfoNode {
    id: string; kind: 'resource' | 'focus' | 'weekly';
    category: 'checkups' | 'nutrition' | 'basics' | 'wellbeing' | 'preparation';
    title: L; summary: L; why?: string; tip?: string;
    questions?: { km?: string[]; en?: string[] };
    weeks?: number[]; weekLabel?: string;      // e.g. "Week 9", "Month 3"
    sources: Source[]; safetyCritical?: boolean;
  }
  ```
- Components: `Header` (title, toggle), `SearchBar`, `FilterChips`, `NodeCard` (§4.1, §4.2), `Footer`. All text via `lang`.
- Search: lowercase substring over the title and summary in the **current** language, after `.normalize('NFC')` and removing `U+200B`. Good enough for now.
**Done when:** the page shows 27 nodes; each has a working expand and its source link(s) under it; no hand-typed health or Khmer text exists in the new files.

**T4 — Language toggle** (§5). **Done when:** switching changes the title, summary and every label of the first node, the search placeholder and the filter chips; `<html lang>` changes; reload keeps the choice.

**T5 — Typography fixes** (§4.2): Kantumruy Pro for Khmer, no negative letter-spacing, line-height ≥ 1.7, no `uppercase` on Khmer.

**T6 — Footer and disclaimer.** One line from Aj. Default if Aj gives nothing: "This site shares information from the sources linked on each card. It does not replace advice from a health worker." (Khmer version: **ask Aj**, do not translate it yourself.)

**T7 — Verify and report** (§7). Put the evidence in the PR description.

---

## 7. Acceptance tests (the agent must run and show results)

**Automated**
1. `npm run check:text` passes with 0 findings.
2. A test script (`scripts/check-nodes.ts`, run with `tsx`) asserts:
   - exactly **11** resources, **3** focus topics, **13** weekly topics become **27** nodes;
   - every resource node's `sources[0].url` is **identical** to the original `sourceUrl` (compare programmatically);
   - every focus/weekly `resourceIds` entry resolves to an existing resource;
   - every node maps to exactly one category slug (no unmapped strings);
   - every Khmer string in nodes is **identical** to the data file's string (no edits);
   - every node has at least one source except nodes whose `resourceIds` is empty (report them).
3. `npm run build` passes; production build has no `supabase`, `genai`, or `express` in `dist/`.

**Manual (screenshots at 360 px, Khmer and English, attach to the PR)**
- Title shows **ម៉ែ** correctly in the header and footer. No `�`, no Chinese characters, no stray letters anywhere.
- Toggle: first node's title and summary change; the search placeholder changes; reload keeps it.
- Tapping a node expands the full text; the source link under the node opens the correct page in a new tab.
- Warning Signs is first and marked.
- Filter chip "Wellbeing" shows **all** Wellbeing nodes (3 resources plus the weekly topics in that group).
- Keyboard: Tab reaches the toggle, the search, each expand button and each source link in order.

---

## 8. Open items for Aj (not the agent's job)

1. **Confirm the scope** in §3: 27 nodes (11 + 3 + 13). Should the 9 monthly letters be added later?
2. **Khmer translations** of the 13 weekly topics (currently English only). They must come from a Khmer speaker and be checked by someone who can verify the health meaning.
3. **Disclaimer wording**, in Khmer and English.
4. Whether the default language should be Khmer (assumed yes).
5. The breastfeeding card links only to the PSI home page; a more specific source could be better (a content decision; the agent must not change it).

---

## 9. Evidence log (how I checked)

- Cloned `i-eat-tea/mae-app` at `8f6bcbd`; the repo has 4 commits: `52e1391` initial, `3ed2127` "Simplify to single-page…", `74beea2` "Restore style, Khmer, 11 info boxes…" (re-added the old app), `8f6bcbd` "Fix: restore style…" (only changed `index.html`).
- Scanned every tracked text file for `U+FFFD` and CJK characters: only `index.html` has them (2 + 2). The data files are clean.
- Ran the original data through `tsx` to count items, fields, categories and links, and compared them with the page (11/11 URLs present, 0/11 Khmer titles, 0/11 Khmer summaries).
- Built the current commit successfully with `npm ci && npm run build`.
- I did **not** open the live site or run the toggle in a browser; the toggle diagnosis comes from reading its code.