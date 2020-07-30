#!/bin/bash
SCR_DIR=$(cd `dirname $0` && pwd)
SCRIPTFN=$(basename -- $SCR_DIR)
DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"

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

docker network rm network_ui_app &> /dev/null
docker network create \
    --driver=bridge \
    --subnet=10.10.10.0/16 \
    --ip-range=10.10.10.0/24 \
    --gateway=10.10.10.254 \
    network_ui_app &> /dev/null
# --------- docker network End ------#

echo "===sh initAdmin.sh=START===\n"
sh initAdmin.sh > /var/bbb.log
echo "===sh initAdmin.sh==END==\n"

echo "\nloading cron job"
echo "{\"code_folder\": \"$PWD\", \"data_folder\": \"$DATA_DIR\"}" > "$DATA_DIR"/_env.json



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

# ----- nginx proxy code Start  -----#
sleep 10;
sh ./nginx_proxy/run_nginx_proxy.sh $DATA_DIR > /var/ccc.log
# ----- nginx proxy code End  -----#

if [ "$OSENV" = "Linux" ]; then
   echo "Running on Linux ..."
fi

