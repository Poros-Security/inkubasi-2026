FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY chall.js ./
COPY index.html ./
COPY flag.txt ./

EXPOSE 4545

CMD ["node", "chall.js"]
