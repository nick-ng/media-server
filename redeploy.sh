git checkout -f main
PORT=3012 docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml build
PORT=3012 docker compose -f docker-compose.yml up -d
