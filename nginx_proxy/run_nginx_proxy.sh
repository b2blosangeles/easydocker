myDir=$( cd ${0%/*} && pwd -P )
DATA_DIR="$1"

CMD=""
CMD="${CMD}Start proxy ..\n";
CMD="${CMD}cd ${myDir}\n";
CMD="${CMD}docker build -t nginx-proxy-image  .\n";
CMD="${CMD}docker container stop nginx-proxy-container\n";
CMD="${CMD}docker container rm nginx-proxy-container\n";
CMD="${CMD}docker run -d -p 80:80 -v \"${myDir}/html\":/usr/share/nginx/html -v \"${DATA_DIR}/proxy\":/usr/share/nginx/proxy_config ";
CMD="${CMD} --network network_ui_app  ";
CMD="${CMD} --name nginx-proxy-container nginx-proxy-image\n";

shell_proxy="${DATA_DIR}/_cron/proxy_$(date +%s%N).sh"

mkdir -p ${DATA_DIR}/_cron/
echo "${CMD}" >> ${shell_proxy}
