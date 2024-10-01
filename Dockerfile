# Docker image for running the backend, which also hosts the frontend files

FROM node:20.17.0 as build
WORKDIR /usr/src/app

# Copy files over
COPY ./backend ./backend
COPY ./frontend ./frontend
COPY ./shared ./shared

# Build frontend
WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build

# Build backend
WORKDIR /usr/src/app/backend
RUN npm install
RUN NODE_ENV=production npm run build

FROM oven/bun:1 AS runner
WORKDIR /usr/src/app

# Copy necessary files from builder to runner
COPY --from=build /usr/src/app/backend/build/index.js /usr/src/app/src/index.js
COPY --from=build /usr/src/app/backend/challenges /usr/src/app/challenges
COPY --from=build /usr/src/app/frontend/dist /usr/src/app/public

EXPOSE 3000
CMD ["bun", "src/index.js"]