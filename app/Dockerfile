FROM node:14
RUN mkdir -p /opt/app/movie-explorer
WORKDIR /opt/app/movie-explorer
COPY package.json .
RUN npm install
COPY . .
CMD npm start