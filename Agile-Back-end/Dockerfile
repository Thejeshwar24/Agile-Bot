#Sample Dockerfile for NodeJS Apps

FROM node:21.4.0

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 5002

CMD [ "node", "index.js" ]