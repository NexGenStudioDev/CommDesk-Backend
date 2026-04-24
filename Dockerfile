FROM guergeiro/pnpm:22-10

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
COPY . .

RUN pnpm install --frozen-lockfile


RUN pnpm build


CMD ["pnpm", "run", "start"]