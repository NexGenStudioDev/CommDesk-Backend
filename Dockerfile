# -------------------------------
# 1. Base Image (Debian-based)
# -------------------------------
FROM node:25-alpine3.22

# -------------------------------
# 2. Set working directory
# -------------------------------
WORKDIR /app

# -------------------------------
# 3. Install pnpm (better way)
# -------------------------------
RUN corepack enable && corepack prepare pnpm@latest --activate

# -------------------------------
# 4. Copy only dependency files (for caching)
# -------------------------------
COPY package.json pnpm-lock.yaml* ./

# -------------------------------
# 5. Install dependencies
# -------------------------------
RUN pnpm install --frozen-lockfile

# -------------------------------
# 6. Copy source code
# -------------------------------
COPY . .

# -------------------------------
# 7. Expose port (if backend)
# -------------------------------
EXPOSE 3000

# -------------------------------
# 8. Start app
# -------------------------------
CMD ["pnpm", "start"]