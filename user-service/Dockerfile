FROM node:14 as base
ENV NODE_ENV=dev
WORKDIR /src
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install
RUN npm install typescript -g
RUN npm install copyfiles -g
RUN tsc 
RUN copyfiles -f src/cert/*.pem dist/src/cert
RUN copyfiles -f package.json dist
COPY . .
CMD [ "node", "dist/src/index.js" ]
