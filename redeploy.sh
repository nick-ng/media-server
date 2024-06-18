git checkout -f main
git pull
npm install
npm run build
PORT=3012 docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml build
PORT=3012 docker compose -f docker-compose.yml up -d
