# create db container
docker-compose up -d

mkdir -p /opt/emilie_xmas/front/letsencrypt/live/xmas-emilie.de
mkdir -p /opt/emilie_xmas/front/letsencrypt/archive/xmas-emilie.de
cp -r /etc/letsencrypt/live/xmas-emilie.de/* /opt/emilie_xmas/front/letsencrypt/live/xmas-emilie.de/
cp -r /etc/letsencrypt/archive/xmas-emilie.de/* /opt/emilie_xmas/front/letsencrypt/archive/xmas-emilie.de/

mkdir -p /opt/emilie_xmas/backend/letsencrypt/live/xmas-emilie.de
mkdir -p /opt/emilie_xmas/backend/letsencrypt/archive/xmas-emilie.de
cp -r /etc/letsencrypt/live/xmas-emilie.de/* /opt/emilie_xmas/backend/letsencrypt/live/xmas-emilie.de/
cp -r /etc/letsencrypt/archive/xmas-emilie.de/* /opt/emilie_xmas/backend/letsencrypt/archive/xmas-emilie.de/

# ToDo
cp -r -a /opt/emilie_xmas/front/dev/. /opt/emilie_xmas/front/www

cd backend/api; dotnet ef database update

cd backend; docker-compose up -d
cd front; docker-compose up -d
