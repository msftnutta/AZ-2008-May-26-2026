# Stage 1: Install dependencies
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY index.js ./
COPY public ./public
USER appuser
EXPOSE 3000
CMD ["node", "index.js"]
