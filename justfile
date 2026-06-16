# wiki12 operator entrypoint (ADR-0005). Wraps docker-compose + per-component
# scripts. `just` over docker-compose; replaces the template's gradle tasks.

set dotenv-load := true

# stamp every image with the single stack version (root VERSION file).
# NOTE: this is read at parse time, BEFORE `bump` runs — build recipes therefore
# re-read VERSION inline after bumping so the freshly-bumped value is stamped.
export WIKI12_VERSION := `cat VERSION`

default:
    @just --list

# bump the PATCH (3rd) number of VERSION deterministically (scripts/bump-version.sh)
bump:
    @scripts/bump-version.sh

# --- stack lifecycle -------------------------------------------------------

# build all images, stamping a freshly-bumped patch version
build: bump
    WIKI12_VERSION="$(cat VERSION)" docker compose build

# start the full stack (build if needed) and follow logs
dev: bump
    WIKI12_VERSION="$(cat VERSION)" docker compose up --build

# start detached
up: bump
    WIKI12_VERSION="$(cat VERSION)" docker compose up --build -d

# stop the stack (keep volumes/images)
dev-stop:
    docker compose down

# stop and remove built images + volumes
dev-clean:
    docker compose down --rmi local --volumes

# tail logs of all (or one) service:  just logs data-service
logs service="":
    docker compose logs -f {{service}}

# validate the compose file without starting anything
check:
    docker compose config -q && echo "compose OK"

# --- models ----------------------------------------------------------------

# validate all document models
validate-models:
    python3 src/model_tools/validate.py models/document-models/*.json

# (re)generate default form models from document models (keeps wiki12.formModel="explicit" ones)
generate-forms:
    node --experimental-strip-types src/dm-to-fm/src/cli.ts models/document-models/*_DM.json --out models/form-models

# like generate-forms but OVERWRITES even explicit (hand-tuned) form models
generate-forms-force:
    node --experimental-strip-types src/dm-to-fm/src/cli.ts models/document-models/*_DM.json --out models/form-models --force

# --- components (offline tests) -------------------------------------------

test-cli:
    cd cli && npm install && npm test

test-lifecycle:
    cd model-lifecycle && npm install && npm test

test-forms:
    cd src/dm-to-fm && npm install && npm test

# the deterministic version-bump script
test-version:
    sh scripts/bump-version.test.sh

# run every offline test + model validation
test: validate-models test-version test-forms test-cli test-lifecycle

# --- content ---------------------------------------------------------------

# seed sample pages + entities (needs a running stack)
seed:
    node --experimental-strip-types seed/seed.ts
