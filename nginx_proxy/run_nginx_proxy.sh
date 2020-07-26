myDir=$( cd ${0%/*} && pwd -P )

echo "===QQ===>"
DATA_DIR=$1
echo $DATA_DIR

cd $myDir       
docker build -t nginx-proxy-image .
docker stop nginx-proxy-container
docker rm nginx-proxy-container

docker stop nginx-proxy-container
docker rm nginx-proxy-container

docker run --name nginx-proxy-container --network network_ui_app -v "$myDir/html":/usr/share/nginx/html -p 80:80 -d nginx-proxy-image
