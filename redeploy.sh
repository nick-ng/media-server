git checkout -f main
git pull

PORT=3012 docker compose -f docker-compose.yml down
PORT=3012 docker compose -f docker-compose.yml build
PORT=3012 docker compose -f docker-compose.yml up -d
