# build environment

FROM node:lts-alpine as build

ARG VUE_APP_API_URL

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.16.0-alpine

ARG VUE_APP_API_URL

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
