# create db container
docker-compose -f db-compose.yml up -d

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

export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$HOME/.dotnet:$HOME/.dotnet/tools:$PATH"
cd /opt/emilie_xmas/backend/api; dotnet-ef database update --verbose

cd /opt/emilie_xmas/backend; docker-compose -f backend-compose.yml up -d
cd /opt/emilie_xmas/front; docker-compose -f front-compose.yml up -d
