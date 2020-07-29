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
   SCRIPTDIR=$(cd `dirname $0` && pwd)
   
   sed '/\@reboot/d' /etc/crontab  > /tmp/crontab_easydocker
   cp -f /tmp/crontab_easydocker  /etc/crontab
   echo "@reboot root cd ${SCRIPTDIR} && sh start.sh" >> /etc/crontab
   
    for (( i=1; i < 60; i+=1 ))
    do
      COMM="sh ${SCRIPTDIR}/cron.sh $DOCKERCMD >> $DATAPATH/log/crontask_$SUDO_USER.log"
      echo "* * * * *  (sleep $i ; echo _UI_APP && $COMM)" >> /etc/crontab
    done
   
fi
# ---- setup cronjob and file permission E ---

