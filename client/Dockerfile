# Sử dụng Node.js làm base image
FROM node:20-alpine

# Install OpenSSL and other necessary build tools
RUN apk add --no-cache openssl libc6-compat

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app/client

# Sao chép package.json và package-lock.json (nếu có)
# tách riêng lệnh này để cache layer khi không có thay đổi trong file package.json
# đa phần các thay đổi sẽ nằm ở các file code chứ không phải file package.json
# nếu không có thay đổi trong file package.json thì lệnh npm install sẽ không chạy
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/


RUN npm install --legacy-peer-deps

# Sao chép toàn bộ mã nguồn
COPY . .

# Chạy lệnh generate cho prisma
RUN npx prisma@5.22.0 generate

# Build ứng dụng Next.js
RUN npm run build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Cài đặt PM2 toàn cục
RUN npm install -g pm2

# Chạy ứng dụng bằng PM2
CMD ["pm2-runtime", "start", "npm", "--", "start"]

# docker login  

# docker build -t kcs-client .
# docker run -p 4000:4000 kcs-client

# docker tag kcs-client kcarestore/kcs-client:latest
# docker push kcarestore/kcs-client:latest

