FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/secure_vault && echo -n "Poros_Secret_Key_2026_xXxXxXxX!!" > /app/secure_vault/master.key

RUN node encrypt_setup.js
RUN rm encrypt_setup.js

RUN mkdir -p /app/logs && echo "Server berjalan normal. Tidak ada error." > /app/logs/server.log

RUN npm run build

RUN rm -rf src Dockerfile docker-compose.yml solve.py tsconfig.json next-env.d.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
