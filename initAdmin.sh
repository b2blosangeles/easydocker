SCR_DIR=$(cd `dirname $0` && pwd)
SCRIPTFN=$(basename -- $SCR_DIR)
DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"
dockerDir="${SCR_DIR}/dockerFiles/admin_dockerfile/"


CMD=""
CMD="${CMD}Start admin ..\n";
CMD="${CMD}cd ${dockerDir}\n";
CMD="${CMD}docker build -f dockerFile -t admin-image .\n";
CMD="${CMD}docker container stop admin-container\n";
CMD="${CMD}docker container rm admin-container\n";
CMD="${CMD}docker run -d -p 10000:10000 -v \"${SCR_DIR}/admin\":/var/_localApp -v \"${SCR_DIR}/dockerFiles\":/var/_localDockerFiles "
CMD="${CMD}-v \"${DATA_DIR}\":/var/_localAppDATA --name  ";
CMD="${CMD} admin-container admin-image\n";

shell_initadmin="${DATA_DIR}/_cron_initAdmin_$(date +%s%N).sh"
mkdir -p ${DATA_DIR}/_cron/
echo "${CMD}" >> ${shell_initadmin}
