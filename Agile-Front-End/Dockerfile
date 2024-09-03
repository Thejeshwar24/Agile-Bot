FROM node:21.4.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5002
CMD ["serve", "-s", "build", "-l", "5002"]