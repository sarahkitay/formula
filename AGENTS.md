<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Product and strategy implementation

When building from strategy docs, Notion specs, or pasted requirements, **do not treat every line as a finalized rule**.

Separate work into:

1. **Confirmed operational rules** - Safe to implement as defaults (code, copy, or config) that stakeholders have locked.
2. **Configurable business settings** - Use env vars, admin-tunable constants, CMS, or database fields; avoid baking one-off assumptions as immovable behavior.
3. **Future / optional / open questions** - Do not ship as hard requirements, final UX, or mandatory copy. Use TODOs, feature flags, or omit until confirmed.

Treat exploratory phrasing (“maybe”, “could”, “consider”, “pilot”) as **not final** unless explicitly stated otherwise.

## Formula public brand (marketing)

Style reference: **deep charcoal / green-black surfaces**, **off-white** typography on dark, **volt yellow-green** `#DCFF00` **sparingly** for accents and CTAs - see `@theme` and `.marketing-site` in `app/globals.css`. Abstract “science” motifs (**thin geometry**, **hex cues**, **grids**) over literal chemistry styling. Avoid collage stacks, torn dividers, and neon overload on the public site.

### Marketing voice (program framing)

Homepage and public program messaging: **`lib/marketing/site-voice.ts`**. Tone is direct and inclusive (all levels), with concrete program lists and emphasis on **precision, technique, and game intelligence**, plus professional coaching and facility quality. Prefer extending that module over one-off hero copy.
