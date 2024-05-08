FROM node:22.1.0-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN chown -R node:node /app
RUN chmod 755 /app

RUN npm i

EXPOSE 4173

USER node

CMD ["npm", "run", "preview"]
