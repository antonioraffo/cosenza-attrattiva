# Immagine di produzione multi-stage (output "standalone" di Next.js).
# Le variabili NEXT_PUBLIC_* sono incorporate nel bundle: vanno passate come build-arg.

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat && npm install -g pnpm@10.34.9
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
ARG NEXT_PUBLIC_SITE_URL=https://cosenzaattrattiva.test
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
ARG NEXT_PUBLIC_FEATURE_3D=false
ARG NEXT_PUBLIC_FLY3D_PROVIDER=google3d
ARG NEXT_PUBLIC_FEATURE_STREETVIEW=false
ARG NEXT_PUBLIC_FEATURE_AR=false
ARG NEXT_PUBLIC_FEATURE_ASSISTANT=false
ARG NEXT_PUBLIC_DEMO_TOOLS=false
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_FEATURE_3D=$NEXT_PUBLIC_FEATURE_3D \
    NEXT_PUBLIC_FLY3D_PROVIDER=$NEXT_PUBLIC_FLY3D_PROVIDER \
    NEXT_PUBLIC_FEATURE_STREETVIEW=$NEXT_PUBLIC_FEATURE_STREETVIEW \
    NEXT_PUBLIC_FEATURE_AR=$NEXT_PUBLIC_FEATURE_AR \
    NEXT_PUBLIC_FEATURE_ASSISTANT=$NEXT_PUBLIC_FEATURE_ASSISTANT \
    NEXT_PUBLIC_DEMO_TOOLS=$NEXT_PUBLIC_DEMO_TOOLS
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-alpine AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
