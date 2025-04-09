# Stage 1: Build React app
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve React app
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
