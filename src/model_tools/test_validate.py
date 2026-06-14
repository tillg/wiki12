#!/usr/bin/env python3
"""Offline tests for the model validator's envelope enforcement.

Run: python3 src/model_tools/test_validate.py   (exit 0 = pass)

Asserts the validator (a) accepts the four canonical content DMs and (b) rejects a
model that is otherwise valid but missing the standard content envelope
(specs/changes/mandatory-content-fields).
"""
import glob
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)

from validate import validate, reference_versions  # noqa: E402

allowed = reference_versions()
failures = []


def check(name, cond):
    print(f"{'✓' if cond else '✗'} {name}")
    if not cond:
        failures.append(name)


# (a) the four canonical content DMs validate clean.
for p in sorted(glob.glob(os.path.join(REPO, "models", "document-models", "*_DM.json"))):
    errs, _ = validate(p, allowed)
    check(f"{os.path.basename(p)} valid (no errors)", not errs)
    if errs:
        for e in errs:
            print(f"      {e}")

# (b) a model missing the envelope is rejected, and the errors name each missing part.
fixture = os.path.join(HERE, "test", "no_envelope_DM.json")
errs, _ = validate(fixture, allowed)
blob = " | ".join(errs)
check("no_envelope_DM rejected", bool(errs))
check("flags missing createdOn", "createdOn" in blob)
check("flags missing Title", "Title" in blob)
check("flags missing changeLog", "changeLog" in blob)

print(f"\n{'FAIL' if failures else 'OK'} — {len(failures)} failed check(s)")
sys.exit(1 if failures else 0)
