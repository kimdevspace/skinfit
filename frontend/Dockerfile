# Dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 빌드된 파일을 /app/dist에 저장
RUN mv /app/build /app/dist