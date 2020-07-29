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

echo "${DATA_DIR}/_cron/initAdmin_$(date +%s%N).sh"

echo $SCR_DIR
echo $DATA_DIR
echo $dockerDir
echo $CMD
<< 'MULTILINE-COMMENT'

const process = require('process');
const path = require('path');
const { exit } = require('process');

const SCRIPT_NAME = path.basename(__dirname );
const DATA_NAME = path.join(__dirname, '..') + '/_' + SCRIPT_NAME + '_DATA';

var dockerDir = __dirname + '/dockerFiles/admin_dockerfile/'

var site_image = 'admin-image';
var site_container = 'admin-container';

var site_path = __dirname + '/admin';
var dockerFiles_path = __dirname + '/dockerFiles';

var cmd = '';
cmd += 'echo "Start admin .."' + "\n";
cmd += 'cd ' + dockerDir + "\n";
cmd += 'docker build -f dockerFile -t ' + site_image + ' .' + "\n";
cmd += 'docker container stop ' + site_container + "\n";
cmd += 'docker container rm ' + site_container + "\n";


cmd += 'docker run -d -p 10000:10000 -v "' + site_path + '":/var/_localApp -v "' + dockerFiles_path + '":/var/_localDockerFiles -v "' + DATA_NAME + '":/var/_localAppDATA --name  ' + site_container + ' ' + site_image  + "\n";

fs = require('fs');
fs.writeFile(DATA_NAME + '/_cron/initAdmin_' + new Date().getTime() + '.sh', cmd, function (err) {
    if (err) return console.log(err);
    console.log('success');
});

console.log(cmd);

MULTILINE-COMMENT
