FROM node:22 AS prod

ENV NODE_ENV=production
ENV PORT=8080
ENV HUSKY=0
ENV REDIS_URL=redis://redis

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm pkg delete scripts.prepare
RUN npm ci

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "./server.js"]
