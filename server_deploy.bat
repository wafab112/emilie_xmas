ssh fabian@173.249.26.235 "cd /opt/emilie_xmas; git pull; ./deploy.sh; cd ../proxy/; docker-compose down; ./deploy.sh;"
