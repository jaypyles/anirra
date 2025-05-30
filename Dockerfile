# Stage 1: Build the frontend application
FROM node:22-alpine as frontend-builder

WORKDIR /frontend

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend/public /frontend/public
COPY ./frontend/src /frontend/src
COPY ./frontend/tsconfig.json /frontend/tsconfig.json
COPY ./frontend/tailwind.config.ts /frontend/tailwind.config.ts
COPY ./frontend/next.config.ts /frontend/next.config.ts
COPY ./frontend/postcss.config.mjs /frontend/postcss.config.mjs

RUN npm run build

# Stage 2: Combine frontend and backend into a single final image with supervisor
FROM python:3.12-slim as final-image

RUN apt update && apt install -y --no-install-recommends supervisor curl uvicorn docker.io npm nodejs && \
    rm -rf /var/lib/apt/lists/* 

RUN python -m pip --no-cache-dir install pdm

# Frontend setup
WORKDIR /app

COPY --from=frontend-builder /frontend/public ./public
COPY --from=frontend-builder /frontend/.next ./.next
COPY --from=frontend-builder /frontend/node_modules ./node_modules
COPY --from=frontend-builder /frontend/package.json ./package.json
COPY --from=frontend-builder /frontend/tsconfig.json ./tsconfig.json
COPY --from=frontend-builder /frontend/tailwind.config.ts ./tailwind.config.ts
COPY --from=frontend-builder /frontend/next.config.ts ./next.config.ts
COPY --from=frontend-builder /frontend/postcss.config.mjs ./postcss.config.mjs
COPY --from=frontend-builder /frontend/src ./src

# Backend setup
WORKDIR /project
COPY pyproject.toml pdm.lock /project/
COPY ./src /project/src/
COPY ./offline-data /project/offline-data/
COPY alembic.ini /project/alembic.ini
COPY alembic /project/alembic/
RUN mkdir -p /project/data && touch /project/data/database.db

RUN pdm install && \
    rm -rf /root/.cache/pip

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY start.sh /start.sh

# Set up log function
RUN echo "function logs() { tail -f /var/log/\$1.log; }" >> /root/.bashrc
RUN echo "function logs_err() { tail -f /var/log/\$1_error.log; }" >> /root/.bashrc