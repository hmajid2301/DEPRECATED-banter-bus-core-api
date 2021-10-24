FROM node:14-alpine3.10 as ts-compiler
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
COPY config.example.yml config.yml
RUN npm run build


FROM node:14-alpine3.10 as ts-remover
WORKDIR /app
COPY --from=ts-compiler /app/package*.json ./
COPY --from=ts-compiler /app/dist/src /app/dist
COPY --from=ts-compiler /app/config.yml /app/config.yml

RUN npm install --only=production
CMD index.js


FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=ts-remover /app ./
USER 1000
CMD ["dist/index.js"]
