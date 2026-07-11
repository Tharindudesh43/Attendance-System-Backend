FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=build /app ./
USER appuser
EXPOSE 8080
CMD ["node", "index.js"]