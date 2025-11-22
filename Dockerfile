# UBAH 1: Gunakan 'alpine' (versi linux ringan) agar hemat RAM Runner
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# UBAH 2: Optimasi npm install
# --no-audit: Jangan cek security (hemat waktu/net)
# --progress=false: Jangan tampilkan progress bar (hemat RAM log)
# --verbose: Agar log tetap jalan dan tidak dikira "hang" oleh Runner
RUN npm install --no-audit --progress=false --verbose

COPY . .

RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production

RUN npm run build-only

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]