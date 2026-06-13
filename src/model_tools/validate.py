#!/usr/bin/env python3
"""Deterministic validator for A12 document models (wiki12).

This is the executable memory of the model-authoring loop: every time the SME
rejects or flags one of our models, we encode the lesson here as a check, so the
authoring agent can never ship that mistake again. Run it before handing models
to the SME.

It learns the accepted `modelVersion`(s) from the known-good reference models in
`docs/a12/sample-models/reference/`, so it self-updates as we add ground truth.

Usage:
    python3 src/model_tools/validate.py            # validate document-models/
    python3 src/model_tools/validate.py <file.json> ...
Exit code 0 = all valid, 1 = at least one error.
"""
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
SAMPLES = os.path.join(REPO, "docs", "a12", "sample-models")
REFERENCE = os.path.join(SAMPLES, "reference")
DEFAULT_TARGETS = os.path.join(SAMPLES, "document-models")

# Field types confirmed from reference models + SME docs (sme-dm-ba-docs).
KNOWN_FIELD_TYPES = {
    "StringType", "NumberType", "BooleanType", "ConfirmType", "DateType",
    "DateTimeType", "TimeType", "DateFragmentType", "DateRangeType",
    "EnumerationType", "CustomType", "TypeDefinitionType",
}
# Element types confirmed from reference models.
KNOWN_ELEMENT_TYPES = {"Group", "Field", "Rule", "Attachment", "MultiSelect", "Include"}


def reference_versions():
    """The modelVersion(s) used by known-good reference models = what the SME accepts."""
    versions = set()
    for p in glob.glob(os.path.join(REFERENCE, "*_DM.json")):
        try:
            versions.add(json.load(open(p))["header"]["modelVersion"])
        except Exception:
            pass
    return versions


def walk(elements):
    for e in elements:
        yield e
        sub = e.get(e.get("type"), {})
        if isinstance(sub, dict) and isinstance(sub.get("elements"), list):
            yield from walk(sub["elements"])


def validate(path, allowed_versions):
    errs, warns = [], []
    try:
        d = json.load(open(path))
    except Exception as e:
        return [f"invalid JSON: {e}"], []

    # --- structure (from reference Contact_DM / Person_DM) ---
    if "header" not in d or "content" not in d:
        return ["missing top-level 'header'/'content'"], []
    h, c = d["header"], d["content"]

    if h.get("modelType") != "document":
        errs.append(f"header.modelType={h.get('modelType')!r}, expected 'document'")

    # --- FINDING #1 (SME, 2025.06): wrong modelVersion is rejected on open. ---
    mv = h.get("modelVersion")
    if allowed_versions and mv not in allowed_versions:
        errs.append(
            f"header.modelVersion={mv!r} not accepted — reference (A12 2025.06) "
            f"models use {sorted(allowed_versions)}. The SME rejects models whose "
            f"version it doesn't recognise.")

    if not h.get("locales"):
        errs.append("header.locales is empty")
    if h.get("id") and not h["id"].endswith("_DM"):
        warns.append(f"header.id={h['id']!r} does not end with '_DM' (convention)")

    mi = c.get("modelInfo", {})
    if mi.get("name") != h.get("id"):
        warns.append(f"content.modelInfo.name={mi.get('name')!r} != header.id={h.get('id')!r}")
    for k in ("modelInfo", "modelConfig", "modelRoot"):
        if k not in c:
            errs.append(f"content.{k} missing")
    mc = c.get("modelConfig", {})
    for k in ("timeZone", "decimalSeparator", "conditionLanguage"):
        if k not in mc:
            warns.append(f"content.modelConfig.{k} missing")

    roots = c.get("modelRoot", {}).get("rootGroups", [])
    if not roots:
        errs.append("content.modelRoot.rootGroups is empty")

    # root level holds only groups/attachments/multi-selects/includes (dev_tutorial_intro_modeling)
    for r in roots:
        if r.get("type") != "Group":
            warns.append(f"root element {r.get('name')!r} is {r.get('type')!r}; "
                         "root level normally holds Groups")

    # --- recursive element checks ---
    ids = {}
    for r in roots:
        if r.get("type") != "Group":
            continue
        for e in walk(r.get("Group", {}).get("elements", [])):
            t, name, eid = e.get("type"), e.get("name"), e.get("id")
            loc = f"{name!r}({eid})"
            if t not in KNOWN_ELEMENT_TYPES:
                errs.append(f"element {loc}: unknown type {t!r}")
            if not eid:
                errs.append(f"element {name!r}: missing id")
            else:
                ids.setdefault(eid, 0)
                ids[eid] += 1
            if t and t not in e:
                errs.append(f"element {loc}: missing '{t}' detail object")
            if t == "Field":
                ft = e.get("Field", {}).get("fieldType", {}).get("type")
                if ft not in KNOWN_FIELD_TYPES:
                    errs.append(f"field {loc}: unknown fieldType {ft!r}")
    dups = [i for i, n in ids.items() if n > 1]
    if dups:
        errs.append(f"duplicate element ids within model: {dups}")

    # --- wiki12 field-level annotation conventions ---
    # Config lives on the fields (sme-dm-ba-docs §Annotations: name/value pairs per
    # element). Collect (field, its wiki12.* annotations).
    key_orders, derived_roles, n_searchable = [], [], 0
    # markdown body/description: a searchable String field with lineBreaksPermitted.
    has_markdown_body = False
    for r in roots:
        if r.get("type") != "Group":
            continue
        for e in walk(r.get("Group", {}).get("elements", [])):
            if e.get("type") != "Field":
                continue
            anns = e.get("annotations", [])
            searchable = any(a.get("name") == "wiki12.searchable" for a in anns)
            st = e.get("Field", {}).get("fieldType", {})
            line_breaks = (st.get("type") == "StringType"
                           and st.get("StringType", {}).get("lineBreaksPermitted") is True)
            derived = next((a.get("value") for a in anns if a.get("name") == "wiki12.derived"), None)
            # the long-text body/description (markdown) — not the derived searchText blob
            if line_breaks and searchable and derived != "searchText":
                has_markdown_body = True
            for a in anns:
                name, val = a.get("name"), a.get("value")
                if name == "wiki12.keyField":
                    key_orders.append((val, e.get("name")))
                elif name == "wiki12.searchable":
                    n_searchable += 1
                elif name == "wiki12.derived":
                    derived_roles.append((val, e.get("name")))
    if not key_orders:
        errs.append("no field annotated wiki12.keyField — slug has no source key field(s)")
    order_vals = [o for o, _ in key_orders]
    if len(set(order_vals)) != len(order_vals):
        errs.append(f"duplicate wiki12.keyField order values: {order_vals}")
    slug_fields = [n for role, n in derived_roles if role == "slug"]
    if len(slug_fields) != 1:
        errs.append(f"expected exactly one field with wiki12.derived=slug, found {slug_fields}")
    if sum(1 for role, _ in derived_roles if role == "searchText") > 1:
        errs.append("more than one field with wiki12.derived=searchText")
    if n_searchable == 0:
        warns.append("no field annotated wiki12.searchable — searchText blob would be empty")
    # domain.md: every content type carries a markdown body/description field —
    # a searchable StringType with lineBreaksPermitted (distinct from searchText).
    if not has_markdown_body:
        errs.append("no searchable markdown field (StringType + lineBreaksPermitted) — "
                    "page needs a 'body', entities a 'description' (domain.md §Markdown)")

    return errs, warns


def main():
    targets = sys.argv[1:] or sorted(glob.glob(os.path.join(DEFAULT_TARGETS, "*.json")))
    allowed = reference_versions()
    print(f"Accepted modelVersion(s) from reference/: {sorted(allowed) or '(none found)'}\n")
    total_err = 0
    for path in targets:
        errs, warns = validate(path, allowed)
        rel = os.path.relpath(path, REPO)
        if errs:
            total_err += len(errs)
            print(f"✗ {rel}")
            for e in errs:
                print(f"    ERROR: {e}")
        else:
            print(f"✓ {rel}")
        for w in warns:
            print(f"    warn:  {w}")
    print(f"\n{'FAIL' if total_err else 'OK'} — {total_err} error(s) across {len(targets)} model(s)")
    sys.exit(1 if total_err else 0)


if __name__ == "__main__":
    main()
