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
   SCRIPTDIR=$(cd `dirname $0` && pwd)
   echo "cd ${SCRIPTDIR}\nsh start.sh &" > ${SCRIPTDIR}/bootup.sh
   chmod 777 ${SCRIPTDIR}/bootup.sh

   echo "Running on Linux ..."
   sed '/\@reboot/d' /etc/crontab  > /tmp/crontab_easydocker
   cp -f /tmp/crontab_easydocker  /etc/crontab
   echo "@reboot root sh ${SCRIPTDIR}/bootup.sh" >> /etc/crontab
   
   
    for (( i=1; i < 60; i+=1 ))
    do
      COMM="sh $ROOTPATH/setup/cronjob.sh $DOCKERCMD >> $DATAPATH/log/crontask_$SUDO_USER.log"
      echo "* * * * *  (sleep $i ; echo _UI_APP && $COMM)" >> /etc/crontab
    done
   
fi
# ---- setup cronjob and file permission E ---

