#!/bin/bash

DOCKER_IMAGE="kimdevspace/spring-boot"
CONTAINER_NAME="spring-boot"
VERSION="latest"

echo "Docker Hub에서 이미지 가져오기"
docker pull $DOCKER_IMAGE:$VERSION

echo "기존 컨테이너 중지 및 제거"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "새 컨테이너 실행"
docker run -d \
  --name $CONTAINER_NAME \
  -p 8080:8080 \
  -v /home/ubuntu/logs:/app/logs \
  --restart unless-stopped \
  $DOCKER_IMAGE:$VERSION

echo "미사용 이미지 정리"
docker image prune -f