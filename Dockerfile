# syntax=docker/dockerfile:1
FROM node:16.10.0
WORKDIR /app
COPY ./ ./
RUN npm update
RUN npm install
CMD ["node", "index.js"]