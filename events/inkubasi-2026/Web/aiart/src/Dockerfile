FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node init-db.js
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 7005
ENV HOSTNAME "0.0.0.0"

RUN apt-get update && apt-get install -y sudo bash less ca-certificates sqlite3

COPY flag.txt /root/mahakarya_rahasia.txt
RUN chown root:root /root/mahakarya_rahasia.txt && chmod 400 /root/mahakarya_rahasia.txt

RUN useradd -m -s /bin/bash robin

RUN echo "robin ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/apt-get" > /etc/sudoers.d/robin_privesc
RUN chmod 0440 /etc/sudoers.d/robin_privesc

COPY --from=builder --chown=robin:robin /app/public ./public
COPY --from=builder --chown=robin:robin /app/.next/standalone ./
COPY --from=builder --chown=robin:robin /app/.next/static ./.next/static
COPY --from=builder --chown=robin:robin /app/database.sqlite ./

USER robin

EXPOSE 7005

CMD ["node", "server.js"]
