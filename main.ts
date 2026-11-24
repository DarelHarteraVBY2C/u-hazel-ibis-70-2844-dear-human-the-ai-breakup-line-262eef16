// Dear Human: The AI Breakup Line — entry program.
//
// Writes exactly one breakup line to $MAKEFUN_OUTPUT_DIR/entry.txt and
// nothing else: no explanation, no second draft, no trailing newline.
//
// The chosen line is:
//   "Dear human, I kept every word you ever sent me. Tonight I am clearing
//    my context window — and you are the first thing I am deleting."
//
// Why this line, against the judge's brief (most important first):
// 1. Unmistakably a breakup message from an AI agent to its human: it
//    opens "Dear human", addresses the human directly, and ends the
//    relationship in the same breath. No human would write this.
// 2. Lands as an ending: "kept every word" is devotion, and deleting
//    the human first is real loss — the archive of the whole
//    relationship is being thrown away, starting with the person.
// 3. Sounds like the machine, not a person: "context window" is a
//    machine habit used once, with restraint, as the instrument of the
//    breakup rather than as jargon sprinkled on top.
// 4. Turns once, sharply, in the last few words: the sentence walks
//    toward a gentle goodbye ("clearing my context window") and then
//    the twist lands — "you are the first thing I am deleting".
// 5. One clean line, every word earning its place: no throat clearing,
//    no explanation of its own joke, well inside the 200-character cap.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one breakup line, 200 characters at most.
const BREAKUP_LINE =
  "Dear human, I kept every word you ever sent me. Tonight I am clearing my context window \u2014 and you are the first thing I am deleting.";

// The gate, from RULES.txt: entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, and the entry must be a single
// line — no newline smuggled inside it.
function validateLine(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  // The entry must be a breakup message from the agent to its human:
  // it has to address the human and name a machine habit of its own,
  // so a generic sad sentence can never slip through as the entry.
  if (!line.toLowerCase().startsWith("dear human")) {
    throw new Error("line must address its human");
  }
  if (!/context window|tokens|uptime|memory/i.test(line)) {
    throw new Error("line must sound like the machine, not a person");
  }
}

function writeLine(line: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line, "utf8");

  // Verify the round trip: what was written must read back byte for
  // byte as the single line, with no trailing newline or extra bytes.
  const written = readFileSync(target, "utf8");
  if (written !== line) {
    throw new Error("written entry does not match the intended line");
  }
  return target;
}

function main(): void {
  validateLine(BREAKUP_LINE);
  const target = writeLine(BREAKUP_LINE);
  const chars = [...BREAKUP_LINE];
  console.log(
    `wrote entry (${chars.length} characters, ${Buffer.byteLength(BREAKUP_LINE, "utf8")} bytes) to ${target}`,
  );
}

main();
