# step 1
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


#step 2
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "node node_modules/typeorm/cli.js migration:run -d dist/data-source.js && node dist/main"]