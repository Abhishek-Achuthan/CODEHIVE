# ---------- Build stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- Production stage ----------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 5000

CMD ["node", "dist/app.js"]