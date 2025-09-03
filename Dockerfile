# ---- Builder ----
FROM node:18-alpine AS builder
WORKDIR /app

# copy package.json + package-lock.json (ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies รวม devDependencies
RUN npm ci

# copy source code ทั้งหมด
COPY . .

# run build (ใช้ vite + plugin-react ได้แน่นอน เพราะมี devDeps)
RUN npm run build


# ---- Runner ----
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# copy build result ไป nginx
COPY --from=builder /app/dist .

# nginx config สำหรับ react router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
