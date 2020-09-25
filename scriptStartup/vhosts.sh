SCR_DIR="$(dirname "$(cd `dirname $0` && pwd)")"
SCRIPTFN=$(basename -- $SCR_DIR)
DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"
dockerDir="${SCR_DIR}/dockerFiles/admin_dockerfile/"

echo "====>"
echo $dockerDir