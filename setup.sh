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
exit 0
# ---- setup cronjob and file permission S ---

echo "setup cronjob"

if [ $OSENV == "Linux" ]; then
   echo "Running on Linux ..."
   sed '/echo _UI_APP/d' /etc/crontab  > /tmp/crontab_easydocker
   cp -f /tmp/crontab_easydocker  /etc/crontab
   echo "@reboot echo _UI_APP && sh start.sh" >> /etc/crontab
fi
# ---- setup cronjob and file permission E ---

