# Runtime base; the workflow/Makefile always passes the real value via
# --build-arg BASE_IMAGE. Keep the default in sync with deploy.yml / Makefile.
# bikinlapak-front-base is shared by front-end services: need a new runtime
# dependency? Add it to Dockerfile.base and bump the tag (v1.1, v2.0, ...).
ARG BASE_IMAGE=asia-southeast2-docker.pkg.dev/project-9567c06f-f9aa-4397-a2c/bikinlapak-staging/bikinlapak-front-base:v1.0

# ---- Stage 1: build ----
FROM ${BASE_IMAGE} AS builder
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---- Stage 2: thin runtime ----
FROM ${BASE_IMAGE}
WORKDIR /app
# Cloud Run injects PORT (8080) at runtime; 8080 is also the sane default.
ENV NODE_ENV=production PORT=8080
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 8080
USER node
CMD ["node", "build"]
