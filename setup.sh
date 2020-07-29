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

if [ $DOCKERCMD = "" ]; then
    echo "Error : Docker installation and running is required!"
    exit 0
fi

if [ $OSENV = "Mac" ]; then
    echo "this is $OSENV environment."
    echo "Error : Do not need run setup on Mac OS X now!"
    exit 0
fi

if [ $USER = "root" ] ;
then
   echo "Running as sudo ..."
else
   echo "Error : Need root user to run the command!"
   exit 0
fi

# ---- setup cronjob and file permission S ---

echo "setup cronjob=$OSENV"



if [ $OSENV = "Linux" ]; then
   
   echo "Running on Linux ..."
   
   SCR_DIR=$(cd `dirname $0` && pwd)
   SCRIPTFN=$(basename -- $SCR_DIR)
   DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"
   
   mkdir -p ${DATA_DIR}/log/
   
   sed '/\echo _EASY_DOCKER/d' /etc/crontab  > /tmp/crontab_easydocker
   cp -f /tmp/crontab_easydocker  /etc/crontab
   echo "@reboot root echo _EASY_DOCKER && cd ${SCR_DIR} && sh start.sh" >> /etc/crontab
   
    #for (( i=1; i < 60; i+=1 ))
    #for i in {1..60..1}
    COMM="sh ${SCR_DIR}/cron.sh >> ${DATA_DIR}/log/crontask_$SUDO_USER.log"
    for i in {1..60}
    do
      echo "* * * * *  (sleep $i ; echo _EASY_DOCKER && $COMM)" >> /etc/crontab
    done
   
      for i in $(seq 0.5 0.5 59.5)
      do
         echo "Welcome $i times"
      done


fi
# ---- setup cronjob and file permission E ---

