docker-compose down
docker rmi emilie_xmas_xmas2021-api
docker rmi emilie_xmas_xmas2021-frontend

mkdir -p /opt/emilie_xmas/front/letsencrypt/live/xmas-emilie.de
mkdir -p /opt/emilie_xmas/front/letsencrypt/archive/xmas-emilie.de
cp -r /etc/letsencrypt/live/xmas-emilie.de/* /opt/emilie_xmas/front/letsencrypt/live/xmas-emilie.de/
cp -r /etc/letsencrypt/archive/xmas-emilie.de/* /opt/emilie_xmas/front/letsencrypt/archive/xmas-emilie.de/

mkdir -p /opt/emilie_xmas/backend/letsencrypt/live/xmas-emilie.de
mkdir -p /opt/emilie_xmas/backend/letsencrypt/archive/xmas-emilie.de
cp -r /etc/letsencrypt/live/xmas-emilie.de/* /opt/emilie_xmas/backend/letsencrypt/live/xmas-emilie.de/
cp -r /etc/letsencrypt/archive/xmas-emilie.de/* /opt/emilie_xmas/backend/letsencrypt/archive/xmas-emilie.de/

# ToDo
cp -r /opt/emilie_xmas/front/dev/* /opt/emilie_xmas/front/www

docker-compose up -d
