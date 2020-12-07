#!/bin/bash
SCR_DIR=$(cd `dirname $0` && pwd)
SCRIPTFN=$(basename -- $SCR_DIR)
DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"

OSENV=""
case "$(uname -s)" in

   Darwin)
     OSENV='Mac'
     ;;
   Linux)
     OSENV='Linux'
     ;;

   CYGWIN*|MINGW32*|MSYS*|MINGW*)
     OSENV='MS Windows'
     ;;
   *)
     OSENV='' 
     ;;
esac

cd ${SCR_DIR}
git pull

mkdir -p "$DATA_DIR"/sites
mkdir -p "$DATA_DIR"/proxy

markfile=$DATA_DIR/mark.data
TMP_PATH=$DATA_DIR/_tmp

rm -fr $TMP_PATH
rm -fr $markfile

pkill -f "sh $TMP_PATH" > /dev/null
pkill -f "sh cron.sh" > /dev/null
sts=1
cntSts=0

DOCKERCMD=$(command -v docker)
MAIN_NET="10.10.10"
MAIN_IP="10.10.10.254"

if  [ "$DOCKERCMD" = "" ]; then
    echo "\nDocker should be installed!"
    exit 1
fi

echo "Loading ...==> $DOCKERCMD"

until [ $sts = 0 ] || [ $cntSts -gt 60 ];
do 
    echo $sts
    docker_state=$($DOCKERCMD ps -q &> /dev/null)
    
    status=$?
    sts=$status
    cntSts=$(($cntSts+1))

    if [ $sts != 0 ] ; then
          echo "..\c"
          sleep 0.5
    fi
done
if [ $cntSts -gt 50  ]; then
echo $cntSts
    echo "\nDocker running is required!"
    exit 1
fi
# --------- docker network Start ------#

NETWORK_NAME=network_easydocker
if [ -z $(docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ] ; then 
    docker network create \
        --driver=bridge \
        --subnet=${MAIN_NET}.0/16 \
        --ip-range=${MAIN_NET}.0/24 \
        --gateway=${MAIN_IP} \
       network_easydocker &> /dev/null
fi
# --------- docker network End ------#

#--- Admin.sh Start ---
sh ${SCR_DIR}/scriptStartup/initAdmin.sh
#--- Admin.sh End ---

echo "\nloading cron job"
echo "{\"main_ip\": \"${MAIN_IP}\", \"code_folder\": \"$PWD\", \"data_folder\": \"$DATA_DIR\"}" > "$DATA_DIR"/_env.json

# ----- nginx proxy Start  -----#
sh ${SCR_DIR}/scriptStartup/nginx_proxy.sh
# ----- nginx proxy End  -----#

# ----- vhosts Start  -----#
sh ${DATA_DIR}/_startUpScript.sh
# ----- vhosts End  -----#

if [ "$OSENV" = "Mac" ]; then
   echo "Running on MAC ..."
   stsCron=1
   until [ $stsCron = 0 ]
   do 
       if [ $stsCron != 0 ] ; then
           sh cron.sh &
       fi
       sleep 1
   done
fi


