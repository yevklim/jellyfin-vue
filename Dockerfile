## This dockerfile builds the client entirely in a Docker context

FROM node:16-alpine AS build

# Install build dependencies for node modules
RUN apk add --no-cache --virtual .build-deps git python make automake autoconf g++ libpng-dev libtool nasm file

# Set workdir
WORKDIR /app

# Copy files to workdir
COPY . .

# Install dependencies
RUN npm ci --no-audit

# Build static site
RUN npm run build

# Deploy built distribution to nginx
FROM nginx:alpine
COPY --from=build /app/src/dist/ /usr/share/nginx/html/
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY .docker/mime.types /etc/nginx/mime.types
