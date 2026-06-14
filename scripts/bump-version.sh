#!/usr/bin/env sh
# Deterministically bump the PATCH (3rd) number of the semver in the VERSION file.
# This is the single source of truth for the version bump — the justfile build
# recipes call it so every build increments the patch (ADR-0005: one stack version).
#
# Usage: bump-version.sh [VERSION_FILE]   (defaults to repo-root VERSION)
# Prints the new version to stdout; leaves MAJOR.MINOR untouched.
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
FILE="${1:-$ROOT/VERSION}"

[ -f "$FILE" ] || { echo "bump-version: no such file: $FILE" >&2; exit 1; }

cur="$(tr -d '[:space:]' < "$FILE")"

major="${cur%%.*}"
rest="${cur#*.}"
minor="${rest%%.*}"
patch="${rest##*.}"

# every component must be a non-empty run of digits, and the string must be MAJOR.MINOR.PATCH
case "$cur" in
    *.*.*.*) echo "bump-version: '$cur' is not MAJOR.MINOR.PATCH" >&2; exit 1 ;;
    *.*.*)   ;;
    *)       echo "bump-version: '$cur' is not MAJOR.MINOR.PATCH" >&2; exit 1 ;;
esac
for n in "$major" "$minor" "$patch"; do
    case "$n" in
        '' | *[!0-9]*) echo "bump-version: non-numeric component in '$cur'" >&2; exit 1 ;;
    esac
done

new="$major.$minor.$((patch + 1))"
printf '%s\n' "$new" > "$FILE"
printf '%s\n' "$new"
