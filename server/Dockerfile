# Sử dụng Node.js làm base image
FROM node:20-alpine

# Install OpenSSL and other necessary build tools
RUN apk add --no-cache openssl libc6-compat

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app/server

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc

# Install pnpm globally
RUN npm install -g pnpm

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install dependencies and rebuild bcrypt
RUN pnpm install
RUN cd node_modules/bcrypt && npm rebuild bcrypt --build-from-source

# Sao chép toàn bộ mã nguồn
COPY . .

# Chạy lệnh generate cho prisma
RUN npx prisma@5.22.0 generate

# Build ứng dụng
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 4000

# Cài đặt PM2 toàn cục
RUN npm install -g pm2

# Chạy ứng dụng bằng PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]

# docker login  

# docker build -t kcs-server .
# docker run -p 4000:4000 kcs-server

# docker tag kcs-server kcarestore/kcs-server:latest
# docker push kcarestore/kcs-server:latest
