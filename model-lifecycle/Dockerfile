# wiki12 model-lifecycle service.
#
# IMPORTANT: build context is the REPO ROOT (not model-lifecycle/), because the
# service imports the form generator read-only from src/dm-to-fm/. The compose
# file sets `context: .` + `dockerfile: model-lifecycle/Dockerfile`.
#
#   docker build -f model-lifecycle/Dockerfile --build-arg WIKI12_VERSION=0.1.0 .
#
# Runs src/server.ts with Node's TypeScript type-stripping; exposes 8090.

FROM node:22-alpine

ARG WIKI12_VERSION=0.1.0
ENV WIKI12_VERSION=${WIKI12_VERSION}
ENV MODEL_LIFECYCLE_PORT=8090
ENV NODE_ENV=production

# isolated-vm is a native addon: needs a C++ toolchain + python to build. Keep
# build deps in a single layer and drop them after install to keep the image lean.
WORKDIR /app/model-lifecycle

# App sources. Both trees are required: the service + the read-only generator.
# Copying sources BEFORE `npm install` ensures the install builds node_modules
# (incl. the isolated-vm native addon for THIS image's arch) last — a host
# node_modules in the build context can never overwrite it.
COPY model-lifecycle/ /app/model-lifecycle/
COPY src/dm-to-fm/ /app/src/dm-to-fm/

# isolated-vm is a native addon: needs a C++ toolchain + python to build. Keep
# build deps in one layer and drop them after install to keep the image lean.
# A fresh, arch-correct install (no reuse of any copied-in node_modules).
RUN rm -rf node_modules /app/src/dm-to-fm/node_modules \
    && apk add --no-cache --virtual .build-deps python3 make g++ \
    && npm install --omit=dev \
    && apk del .build-deps

EXPOSE 8090

CMD ["node", "--experimental-strip-types", "src/server.ts"]
