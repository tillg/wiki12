// Tiny hand-rolled argument parser. No heavy framework (per constraints).
//
// Splits an argv tail into positionals, flags (--name value), and boolean
// switches (--flag). Recognizes -h/--help.

export interface ParsedArgs {
  positionals: string[];
  flags: Record<string, string>;
  switches: Set<string>;
  help: boolean;
}

// `booleanFlags` lists flags that take NO value (e.g. "dry-run"); everything
// else that starts with "--" consumes the next token as its value.
export function parseArgs(
  argv: string[],
  booleanFlags: string[] = [],
): ParsedArgs {
  const boolSet = new Set(booleanFlags);
  const positionals: string[] = [];
  const flags: Record<string, string> = {};
  const switches = new Set<string>();
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok === "-h" || tok === "--help") {
      help = true;
      continue;
    }
    if (tok.startsWith("--")) {
      const name = tok.slice(2);
      if (boolSet.has(name)) {
        switches.add(name);
      } else {
        const next = argv[i + 1];
        if (next === undefined || next.startsWith("--")) {
          // No value provided — treat as a switch so callers can detect it.
          switches.add(name);
        } else {
          flags[name] = next;
          i++;
        }
      }
      continue;
    }
    positionals.push(tok);
  }

  return { positionals, flags, switches, help };
}
