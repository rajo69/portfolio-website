# What I need from you

Paste it in whatever form you have it, a CV, a LinkedIn export, raw notes. I'll normalise it into `src/content/*.ts`. Don't format it nicely for me; that's my job.

Ordered by how much it unblocks.

---

## 1, Blocks the whole build (send first)

> Accent is locked to **Plasma `#FF3D8B`**. Audience: all three, hiring first. Case studies: full pages for the 4 Lab projects. Phase 1 of the build is unblocked and can start now.

**Your headline.** 6, 10 words, declarative, no hedging. It runs the logit-lens decode animation and it's the first thing anyone reads. My draft is *"I build the model, then I open it up."*, approve it or replace it.

**Three hero stats.** The reference uses `$185M` / `$850M+` / `9 MO`. Yours need to be equally checkable. Candidates from what I can see: public repo count, smallest model you've GRPO-tuned, an eval delta, papers/notebooks published, documents indexed in a RAG system. Three, no more.

---

## 2, Work experience

Per role:

```
Company        ·
Role           ·
Dates          ·  YYYY-MM to YYYY-MM (or "present")
Location       ·
What you owned ·  one sentence
Highlights     ·  2, 4 bullets
Tools          ·
```

**On the bullets.** This is where the site lives or dies. The reference's credibility is entirely quantified, *"$185M new-business revenue"*, *"zero to $1M ARR in nine months"*. Lead with a verb, land a number:

- ❌ "Worked on a RAG pipeline for compliance documents"
- ✅ "Cut retrieval latency 340ms → 90ms across 12k regulatory documents, lifting precision@5 from 0.61 to 0.83"

If a number genuinely doesn't exist, say what changed instead, I won't invent one and you shouldn't either. A hollow number is worse than none; anyone technical will ask about it in an interview.

---

## 3, Education

```
Institution · Degree · Field · Dates · Location · Grade
Thesis / dissertation title
Notable modules, awards, publications
```

Your GitHub points to *"Enhancing Neural Network Robustness using Hybrid Adversarial Training"* as the dissertation, confirm and tell me where it sat. On a research-track site the thesis title pulls real weight.

---

## 4, Certifications

```
Name · Issuer · Issued (YYYY-MM) · Expires · Credential ID · Verification URL
```

**Send the verification URLs.** The site's whole argument is receipts over claims. A cert that links to a live credential page is proof; one that doesn't is a line of text.

---

## 5, Project metrics (the Lab section)

Four projects become the Lab, the site's centrepiece. I've pre-selected them in `src/content/projects.ts`:

| Project | What I need |
|---|---|
| `job-apply-harness` | Cost/run before & after, guard pass rate, runs completed |
| Gated attention | Gate sparsity %, Δ perplexity on override, heads analysed |
| `text2cypher-grpo-sub2b` | Execution accuracy vs. baseline, param count, training cost |
| UKGC LCCP RAG | precision@5, grounded-answer rate, corpus size |

For each, also:
- The **`Proves:` line**, one sentence on what it demonstrates about you as an engineer. This is the device that turns a repo into an argument. Reference examples: *"I build the demand layer, not just the deck."* / *"The engine behind a board-ready GTM is real and shippable, not a projection on a slide."*
- A **series of numbers** behind the headline metric if you have one (loss curve, reward curve, a histogram), it becomes the live chart on the card.
- Any **live demo URLs**.

If the numbers aren't handy, point me at the repo path (notebook, eval JSON, README table) and I'll pull them out myself.

---

## 6, Curation

You have 56 public repos. I've drafted 16 into `projects.ts`. **A portfolio that shows everything shows nothing**, I'd cap the Work list at ~12 rows. Tell me what to cut and what I've missed. Several repos have no description at all (`chronoagent`, `ai-content-engine`, `voice-loop`, `mini-intent-net`), one line each and they're usable.

---

## 7, Decisions

| | |
|---|---|
| **Domain** | `rajarshinandi.com`? `rajarshi.dev`? Affects canonical URLs, OG tags, JSON-LD. |
| **LinkedIn / Scholar / X** | URLs for the footer. |
| **CV download** | PDF at `/cv`? |
| **Photo** | The reference has none, and it works. Your call. |

Already decided: accent (Plasma), audience (hiring first), case studies (full pages for the 4 Lab projects), contact (mailto only).

### Case study write-ups, 4 × ~300 words

One per Lab project, in this shape. Bullets and fragments are fine; I'll write the prose.

```
Problem   ·  what was actually hard, and why the obvious approach fails
Approach  ·  what you did, and the one non-obvious decision you made
Shipped   ·  what exists now that didn't before
Result    ·  the measured outcome + how it was measured
Honest    ·  what didn't work, or what you'd do differently
```

That last line is worth including. Every portfolio claims success; almost none says where the edges were, and to a technical reader that reads as confidence rather than weakness.

---

## 8, Nothing to send

Handled from your GitHub already: repo list, languages, contribution graph, stars, activity. The Proof strip pulls live from the API at build time.
