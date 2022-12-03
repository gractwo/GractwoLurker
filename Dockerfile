# syntax=docker/dockerfile:1
FROM node:16.10.0
WORKDIR /app
COPY ./ ./
RUN npm update
RUN npm install
RUN npx prisma db push
CMD ["node", "index.js"]