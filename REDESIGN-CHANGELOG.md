# Playzy UI redesign — changelog

Direction: **"Quiet study desk."** A calm, text-first workspace for students and writers. Neutral surfaces with a slight green tint, teal as the only accent, a reading serif for headings and output, no glows or gradients.

The original source is backed up at `../.redesign-backup/` (there is no git repository). Delete that folder once you're happy with the redesign.

## Score changes

| # | Category | Before | After | What moved it |
|---|---|---|---|---|
| 1 | Layout & Structure | 4 | 8 | One logo, one breadcrumb. Home is a writing screen instead of the Robin OSINT tool. Duplicate in-tool "Back to…" rows removed from 6 tools. |
| 2 | Typography | 4 | 8 | 13 arbitrary sizes → 0. Weights went from 568 bold/extrabold/black to a medium/semibold scale. Fonts are self-hosted through `next/font`. |
| 3 | Color System | 3 | 9 | 998 hex literals → 10 (all are brand logos like YouTube red). 2,082 slate classes plus 15 other hue families → semantic tokens. Light/dark contrast is AA or better. |
| 4 | Spacing & Rhythm | 5 | 7 | 7 radii → 3 (controls, cards, pills). Consistent page gutters. Spacing inside the larger tools is unchanged. |
| 5 | Component Design | 4 | 7 | New `components/ui` primitives. The shell and home use them; the large tool files still use inline classes, now on tokens. |
| 6 | Visual Hierarchy | 4 | 8 | Monochrome sidebar with no badges. Color marks only the active item and the one primary action. |
| 7 | CTA & Conversion | 4 | 8 | The dead "Upgrade to Pro" is gone. Home has one primary action (Paraphrase), and links are auto-routed to the right tool. |
| 8 | Accessibility | 3 | 7 | Global `:focus-visible` ring. aria-labels went from 8 to 44. Skip link. `aria-current`/`aria-expanded` on nav. Escape closes dialogs. `prefers-reduced-motion`. Touch targets on coarse pointers. |
| 9 | Branding & Identity | 4 | 8 | Skywork look-alike removed. Visible "ElevenLabs"/"Skywork" claims replaced with neutral copy. |
| 10 | Overall Polish | 3 | 8 | Dark mode works everywhere: every component is token-driven, so no `dark:` variants are needed. 142 no-op classes removed. Hydration error fixed. The theme toggle shows the right icon. |
| 11 | Motion & Interaction | 5 | 7 | One `enter` animation and one timing scale. Decorative pulses and pings removed. Hover scale/translate removed. |
| 12 | Responsive & Mobile | 5 | 8 | Controls under 32px on the paraphraser went from 25 to 1. No horizontal overflow at 375px. The drawer closes on Escape. |
| | **Average** | **4.0** | **7.75** | |

## Tier 1 — Design tokens

- **`app/globals.css`** (rewritten)
  - Color tokens are CSS variables (`--c-bg`, `surface`, `sunken`, `line`, `line-strong`, `fg`, `muted`, `accent`, `accent-hover`, `accent-soft`, `on-accent`, plus success/warning/danger/info and their `-soft` variants).
  - Light is the base theme; `html.dark` overrides the same names.
  - Also contains: a global focus ring, selection color, neutral scrollbars, the `.prose-reading` and `.eyebrow` helpers, coarse-pointer touch sizing, a reduced-motion override, and one `enter` keyframe.
- **`tailwind.config.js`** (rewritten)
  - Colors map to the tokens, so `bg-accent/10` still works.
  - Type scale: sizes above `5xl` are capped at 40px.
  - Radii: `md`, `lg` and `xl` resolve to the 6px control radius; `2xl` and `3xl` resolve to the 10px card radius.
  - `shadow` and `shadow-sm` are flat; larger shadows are reserved for overlays.
  - Adds an `xs` (420px) breakpoint, a 120/200ms timing scale, and `font-serif`/`font-mono`.
- **`app/layout.tsx`**
  - Instrument Sans, Newsreader and JetBrains Mono load through `next/font`, replacing the blocking Google Fonts link with 16 weights.
  - Theme colors updated.
  - JSON-LD moved into `<body>` so AdSense's head injection no longer causes hydration mismatches.

**Palette**

| Token | Light | Dark |
|---|---|---|
| bg | `#F6F8F7` | `#0D1312` |
| surface | `#FFFFFF` | `#141B1A` |
| fg | `#13201D` (15.7:1) | `#E7EDEB` (15.8:1) |
| muted | `#52615C` (6.1:1) | `#98A6A2` (7.4:1) |
| accent | `#00756A` (5.6:1) | `#00C9A7` (8.9:1) |

## Tier 2 — Primitives (new, `components/ui/`)

- `cn` combines clsx with tailwind-merge.
- `Button` has variants primary/secondary/ghost/danger and sizes sm/md/lg, plus a `loading` state.
- `IconButton` requires a `label`, which becomes its aria-label and title.
- `Card`, `Input`, `Textarea`, `Badge` (6 tones), `Tabs` (role=tablist), `PageHeader`, `EmptyState`.

## Tier 3 — Shell

- **Header** (`PlayzyApp.tsx`) now has only the logo, a tool search (with a Ctrl/Cmd+K shortcut) and the theme toggle.
  - Removed: the non-functional Upgrade to Pro, Model, Personal Workspace and avatar items, and the duplicate Downloader shortcut.
  - Added a skip-to-content link.
- **Breadcrumb**: one `Home › Tool` row, using sidebar names.
- **Sidebar** (`AppSidebar.tsx`, rewritten)
  - Groups: Home and Saved work, then Writing (first), Transcribe, Voice & audio, Download & convert, and Research (Robin and Email Lookup).
  - Monochrome icons, no badges, a 256px width, `aria-current` on the active item, collapsible groups with `aria-expanded`, and Escape to close on mobile.
- **All-tools dialog**: a real searchable command dialog. It opens from the header and Ctrl/Cmd+K, Enter opens the first match, Escape closes it, and it locks page scroll.
- **Routing**: `/` opens the home screen; it used to open Robin. `/tools` redirects to `/`.

## Tier 4 — Home (`PlayzyHomeScreen.tsx`, rewritten, 1,160 → 497 lines)

- The heading "What are you writing today?" sits above a serif editor with word and character counts and a .txt upload.
- Action row: **Paraphrase** (primary), Check grammar, Detect AI, Summarize, Humanize and Ask AI. Each one opens its tool with the text already filled in.
- YouTube/TikTok links, `.onion` queries and email addresses are detected, and the primary button changes to "Open in …".
- The AI chat thread was kept and simplified.
  - Replies are set in the reading serif.
  - Each reply has Copy, Paraphrase, Read aloud and Try again.
  - Thumbs feedback buttons have `aria-pressed`.
  - Errors are shown honestly instead of a canned "success" reply.
  - Removed the fake "reasoning steps" and the "zero hallucinations" claim.
- A "More tools" grid lists five tools plus Browse all.

## Tier 5 — Tool studios

All of these were migrated by a codemod that maps palette, hex, size and weight classes to tokens.

- **Writing studio** (`QuillBotAiStudio.tsx`)
  - The header card is now a serif title with an underline tab row (`role=tab`).
  - The "World's Favorite…" tagline and the "Playzy AI" badge are removed.
  - Inputs and outputs use the reading serif.
  - The mode bar no longer has a separate panel.
  - Light-only before; now themed.
- **Transcriber, Audio DSP, Audio Translator, MP3 converters, Voice Studio, Torrent**
  - Removed the duplicate "Back to … Tools" rows.
  - Headings use the serif scale.
  - Blur blobs and glows removed.
  - Brand claims removed from Voice Studio.
- **Downloader**
  - One heading instead of two.
  - The fake demo result ("Container to show how the UX works") is gone; results appear only after a real link.
- **Robin**: duplicate breadcrumb removed.
- **Shared**: 45 in-flow shadows removed (overlays keep theirs). 26 aria-labels added to icon-only and titled buttons. Text on solid accent buttons uses `on-accent`.

## Tier 6 — TVPulsar & watch pages

- Migrated to tokens.
- Hero heading moved to the serif scale.
- Glows removed.
- Root text color fixed.

## Files

- **New:** `components/ui/{cn.ts, Button.tsx, primitives.tsx, index.ts}`, `REDESIGN-CHANGELOG.md`, `../.claude/launch.json` (preview config).
- **Rewritten:** `app/globals.css`, `tailwind.config.js`, `components/AppSidebar.tsx`, `components/HomeScreen/PlayzyHomeScreen.tsx`, and the shell JSX in `components/PlayzyApp.tsx`.
- **Modified:** `app/layout.tsx`, `app/page.tsx`, `app/tools/page.tsx`, `app/tvpulsar/TVPulsarLandingClient.tsx`, `app/watch/[id]/WatchPlayerClient.tsx`, `lib/categories.ts` (copy only), and every other component under `components/` (34 files).
- **Untouched:** all API routes, `lib/api.ts`, `lib/types.ts`, the tool logic and state, URLs, SEO metadata, AdSense and Analytics.

## Verification

- `tsc --noEmit` passes and `next build` succeeds (all 43 routes).
- Checked in the browser at 1280px and 375px, in light and dark, on: home, paraphraser, AI detector, transcriber, voice generator, volume booster, podcast, audio translator, YouTube to MP3, downloader, saved work, Robin, email lookup, torrent and TVPulsar.
- Not exercised: flows that need the backend (it was offline), such as real downloads, transcription results and chat replies. Their result states were restyled by the codemod but not seen rendered.

## Known follow-ups

- The large tool files (Robin is 2,200 lines, Voice Studio 2,200, the writing studio 2,200) still use inline class strings instead of the `ui` primitives. Moving them over is the next consistency step.
- 10 `animate-pulse` uses remain. They are loading skeletons and recording indicators, so they are functional.
- Marketing badges inside tools ("100% Free", "Unlimited") were kept as copy. A copy pass would tighten them.
- Removed the unverified 4.95 / 24,890-review `aggregateRating` from the site-wide structured data in `app/layout.tsx`. `app/tvpulsar/page.tsx` still has its own 4.9 / 1,540-review rating.
