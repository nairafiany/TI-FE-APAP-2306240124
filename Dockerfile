FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

# Hanya butuh satu API URL untuk TI Anda
ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

# UBAH DISINI: Gunakan 'install' untuk fix cache & pastikan dependency terdownload
RUN npm install

COPY . .

# Membuat file .env.production hanya dengan satu variabel API
RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production

# UBAH DISINI: Gunakan 'build-only' agar lebih ringan & menghindari error run-p
RUN npm run build-only

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]