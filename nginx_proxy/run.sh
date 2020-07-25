git pull

docker network rm network_ui_app &> /dev/null

docker network create \
    --driver=bridge \
    --subnet=10.10.10.0/16 \
    --ip-range=10.10.10.0/24 \
    --gateway=10.10.10.254 \
    network_ui_app &> /dev/null
        
docker build -t some-content-nginx .
docker stop some-nginx
docker rm some-nginx

docker stop local_proxy_container
docker rm local_proxy_container


docker run --name some-nginx --network network_ui_app -v "$(pwd)/html":/usr/share/nginx/html -p 80:80 -d some-content-nginx
