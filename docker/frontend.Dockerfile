FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

FROM node:22-alpine AS frontend-runtime

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --omit=dev

COPY frontend ./
COPY --from=frontend-build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
