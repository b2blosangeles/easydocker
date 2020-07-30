#!/bin/bash
git pull

# ---- prepare S -----
DOCKERCMD=$(command -v docker)
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

if [ $OSENV = "Mac" ]; then
    echo "this is $OSENV environment."
    echo "Error : Do not need run setup on Mac OS X now!"
    exit 0
fi

if [ $USER = "root" ] ;
then
   echo "Running as root ..."
else
   echo "Error : Need root user to run the command!"
   exit 0
fi

# ---- setup cronjob and file permission S ---

if [ $OSENV = "Linux" ]; then
   
   echo "Running on Linux ..."
   
   SCR_DIR=$(cd `dirname $0` && pwd)
   SCRIPTFN=$(basename -- $SCR_DIR)
   DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"
   
   mkdir -p ${DATA_DIR}/log/
   
   sed '/\echo _EASY_DOCKER/d' /etc/crontab  > /tmp/crontab_easydocker
   cp -f /tmp/crontab_easydocker  /etc/crontab
   echo "@reboot root (echo _EASY_DOCKER && sh ${SCR_DIR}/start.sh)" >> /etc/crontab
  
   COMM="sh ${SCR_DIR}/cron.sh >> ${DATA_DIR}/log/crontask.log"
   for i in $(seq 0.5 0.5 59.5)
   do
      echo "* * * * *  root (sleep $i ; echo _EASY_DOCKER && $COMM)" >> /etc/crontab
   done
fi
# ---- setup cronjob and file permission E ---

