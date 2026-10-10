FROM node:24-alpine AS web
WORKDIR /build
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci
COPY apps/web ./apps/web
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY services/api/requirements.lock ./requirements.lock
RUN pip install --no-cache-dir -r requirements.lock
COPY services/api/ ./
COPY --from=web /build/apps/web/dist /app/web-dist
COPY infra/start-hosted.sh /app/start-hosted.sh
RUN useradd --create-home medfind && chown -R medfind:medfind /app
USER medfind
ENV WEB_DIST=/app/web-dist
EXPOSE 10000
CMD ["sh", "/app/start-hosted.sh"]
