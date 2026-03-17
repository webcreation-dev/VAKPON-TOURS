# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/uploads ./uploads
# Temporarily copy .env if needed, though compose will handle it
# COPY .env .env 

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
