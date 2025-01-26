#!/bin/bash
CONTAINER_NAME="react-app"
IMAGE_NAME="kimdevspace/react-app:latest"

docker pull $IMAGE_NAME

docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

docker run -d \
  --name $CONTAINER_NAME \
  --restart=always \
  -p 3000:80 \
  $IMAGE_NAME

echo "미사용 이미지 정리"
docker image prune -f
