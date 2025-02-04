#!/bin/bash

DOCKER_IMAGE="kimdevspace/spring-boot"
CONTAINER_NAME="spring-boot"
NETWORK_NAME="nginx-spring"  # 기존 네트워크 사용
VERSION="latest"

echo "네트워크 확인"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    echo "Error: 네트워크 '$NETWORK_NAME'가 없습니다."
    exit 1
else
    echo "네트워크 '$NETWORK_NAME' 사용"
fi

echo "Docker Hub에서 이미지 가져오기"
docker pull $DOCKER_IMAGE:$VERSION

echo "기존 컨테이너 중지 및 제거"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "새 컨테이너 실행"
docker run -d \
  --name $CONTAINER_NAME \
  --network $NETWORK_NAME \
  -p 8080:8080 \
  -v /home/ubuntu/logs:/app/logs \
  --restart unless-stopped \
  $DOCKER_IMAGE:$VERSION

echo "미사용 이미지 정리"
docker image prune -f

echo "배포 완료"
echo "컨테이너 로그 확인:"
docker logs $CONTAINER_NAME