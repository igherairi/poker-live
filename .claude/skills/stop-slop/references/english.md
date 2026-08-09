# Stop Slop — English writing without AI tics

Load this when the target text is in English (prose, docs, README, emails,
posts) or when English code artifacts (commits, PRs, comments) are involved.
Same rule as the main skill: every sentence must carry information or a stance.
If a sentence can be cut with no loss of meaning, it is slop — cut it.

## Ban list — English prose

**Hollow openers / connectors**
- "In today's fast-paced world", "In the world of …", "In an era where …"
- "It's important to note that", "It's worth mentioning that"
- "When it comes to …", "At its core", "Let's dive in", "Let's explore"
- "plays a crucial/pivotal/vital role", "is a cornerstone of"

**Empty conclusions**
- "In conclusion", "To sum up", "All in all" followed by a content-free recap
- "The possibilities are endless", "Only time will tell"
- "Whether you're a beginner or an expert, …"

**Automatic rhetorical structures**
- "It's not just X, it's Y." / "This isn't about X. It's about Y."
- "Not because …, but because …" on repeat
- Rule-of-three everywhere: "fast, reliable, and intuitive"
- Question-then-answer filler: "So how do you do it? It's simple."

**Overused LLM vocabulary**
- "delve", "leverage", "utilize" (use "use"), "seamless", "robust",
  "game-changer", "unlock", "elevate", "supercharge", "tapestry",
  "testament", "navigate the landscape", "in the realm of"

**Hedging / over-qualification**
- "It's important to", "arguably", "to some extent", "in a sense",
  "generally speaking", "at the end of the day"

**Punctuation tics**
- Em-dash `—` as dramatic breath → prefer comma, parenthesis, period, or colon.
  (A genuine parenthetical em-dash is fine.)
- Decorative emojis leading bullets, bold on every keyword, "✨/🚀/🔥" filler.

## Ban list — code, commits, PRs (English)

- Commits: no "This commit …", no "In this change we …".
  → Imperative and direct: "Add retry on push", "Fix null hand parsing".
- No line-by-line paraphrase of the diff. State the *why* if non-obvious,
  otherwise stay short.
- Comments: explain non-obvious intent, don't restate what the code does.
  Delete "// increment i" and friends.
- PR descriptions: what changes, why, how to verify. No ceremonial intro.

## Do this instead

- **Strong verbs, concrete subjects.** "It crashes when X" > "an error may
  occur under certain circumstances".
- **Numbers and examples** over adjectives. "8 min" > "much faster".
- **Take a position.** A clear recommendation > a balanced survey.
- **Vary sentence length.** A short one after two long ones. Give it rhythm.
- **Cut.** Aim for -30% words on the second pass.

## Review pass (required before returning)

Reread the output line by line and check:
1. Zero phrases from the ban list. If present → rewrite.
2. Every paragraph has one idea. If not → merge or delete.
3. No dramatic `—`; punctuation is justified.
4. The last sentence adds something (not a hollow recap).
5. If it's a commit/PR: imperative, factual, no filler.

Fix any failing point before delivering. Never return text that hasn't passed
this review.
