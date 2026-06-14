#!/usr/bin/env sh
# Test for bump-version.sh — deterministic patch bump, no AI in the loop.
set -eu

DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
BUMP="$DIR/bump-version.sh"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
fail=0

# bumps the patch, leaves major.minor alone; updates the file AND prints the new value
ok() { # input expected
    printf '%s\n' "$1" > "$tmp"
    out="$("$BUMP" "$tmp")"
    infile="$(cat "$tmp")"
    if [ "$out" = "$2" ] && [ "$infile" = "$2" ]; then
        echo "ok: $1 -> $2"
    else
        echo "FAIL: $1 -> out='$out' file='$infile' (expected '$2')"; fail=1
    fi
}

# rejects garbage and leaves the file untouched
rejects() { # input
    printf '%s\n' "$1" > "$tmp"
    if "$BUMP" "$tmp" >/dev/null 2>&1; then
        echo "FAIL: accepted invalid '$1'"; fail=1
    elif [ "$(cat "$tmp")" != "$1" ]; then
        echo "FAIL: mutated file on invalid '$1'"; fail=1
    else
        echo "ok: rejected '$1'"
    fi
}

ok 0.1.0 0.1.1
ok 1.9.9 1.9.10
ok 0.0.0 0.0.1
ok 2.34.99 2.34.100
ok 10.20.30 10.20.31

rejects abc
rejects 1.2
rejects 1.2.3.4
rejects 1.x.0
rejects ''

if [ "$fail" = 0 ]; then
    echo "bump-version: all passed"
else
    echo "bump-version: FAILURES"; exit 1
fi
