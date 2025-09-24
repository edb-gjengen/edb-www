# Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Serve
FROM nginx:stable-alpine AS runtime

COPY --from=build /app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

