# Build
FROM node:18-alpine AS build

WORKDIR /edb-www

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve
FROM nginx:stable-alpine AS runtime

COPY --from=build /edb-www/app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

