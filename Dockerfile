FROM node:fermium-alpine3.14 as ts-compiler
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . ./
RUN cp config.example.yml config.yml
RUN npm run build


FROM node:fermium-alpine3.14 as ts-remover
WORKDIR /app

COPY --from=ts-compiler /app/package*.json ./
COPY --from=ts-compiler /app/dist/ /app/dist
COPY --from=ts-compiler /app/config.yml /app/config.yml

RUN npm install --only=production
CMD index.js


FROM gcr.io/distroless/nodejs:14
WORKDIR /app

COPY --from=ts-remover /app ./

USER 1000
CMD ["dist/src/index.js"]
