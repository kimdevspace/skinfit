#!/bin/bash
CONTAINER_NAME="react-app"
IMAGE_NAME="kimdevspace/react-app:latest"

docker pull $IMAGE_NAME

docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# 볼륨 마운트 추가하여 빌드된 파일을 EC2의 Nginx와 공유
docker run -d \
  --name $CONTAINER_NAME \
  --restart=always \
  -v /var/www/html:/usr/share/nginx/html \
  $IMAGE_NAME

echo "미사용 이미지 정리"
docker image prune -f
