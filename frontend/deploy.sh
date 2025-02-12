#!/bin/bash
CONTAINER_NAME="react-app"
IMAGE_NAME="kimdevspace/react-app:latest"

docker pull $IMAGE_NAME

docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# 컨테이너 실행
docker run -d \
  --name $CONTAINER_NAME \
  --restart=always \
  $IMAGE_NAME

# 컨테이너에서 빌드 파일들을 EC2의 Nginx 디렉토리로 복사
sudo docker cp $CONTAINER_NAME:/app/dist/. /var/www/html/

sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

sudo systemctl restart nginx

echo "미사용 이미지 정리"
docker image prune -f