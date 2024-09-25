git checkout -f main
git pull
npm install
npm run build
sudo PORT=80 docker compose -f docker-compose.yml down
sudo PORT=80 docker compose -f docker-compose.yml build
sudo PORT=80 docker compose -f docker-compose.yml up -d
