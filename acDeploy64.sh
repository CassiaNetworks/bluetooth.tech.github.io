#!/bin/sh

VERSION=1.01
SCRIPT_NAME=$(basename "$0")
CMD_STR=$0
WORK_DIR="$( cd "$( dirname "$0"  )" && pwd  )"
IMG_NAME=cassia/updater64
DO_RESTART_AC=0

all=$(ls -l /sys/class/net/ | grep -v virtual | awk '{print $9}')
one=$(echo $all | cut -d " " -f 1)
MAC=$(cat /sys/class/net/$one/address)
DOCKER_RUN_OPT="--mac-address=$MAC"
DOCKER_ENTRY=""
CONTAINER_NAME=ac64

#set -x

# Display help message
display_help() {
    echo "Usage: $CMD_STR [options]"
    echo "Default: run ${CMD_STR} with no option, then create new AC container with image $IMG_NAME"
    echo "Options:"
    echo "  -h, --help     Display this help message"
    echo "  -v, --version  Display script version"
    echo "  -m, --image    Create new AC container with input docker image and run"
    echo "                 ${CMD_STR} -m $IMG_NAME"
    echo "  -k, --keep     Create new AC container in privileged mode, shared host net"
}

if [ $# -eq 0 ]; then
  DO_RESTART_AC=1
fi

# Parse command-line arguments
while [ $# -gt 0 ]; do
  opt="$1"
  arg="$2"

  case $opt in
    -h|--help)
      display_help
      exit 0
      ;;
    -v|--version)
      echo "Script version: $VERSION"
      exit 0
      ;;
    -m|--image)
      echo "Docker Image Name: $arg"
      if [ x$arg == x"" ]; then
        DO_RESTART_AC=1
        echo "Image not found, use default image $IMG_NAME"
      else
        IMG_NAME=$arg
        DO_RESTART_AC=1
        shift 1
      fi
      ;;
    -k|--keep)
      DOCKER_RUN_OPT="$DOCKER_RUN_OPT --net=host --privileged=true"
      DO_RESTART_AC=1
      ;;
    *)
      echo "Invalid option: $opt"
      display_help
      exit 1
      ;;
    esac

    shift
done

docker_run_ac() {
  local optPort="-p 443:443 -p 80:80 -p 8001:8001 -p 9999:9999 -p 5246:5246/udp -p 5247:5247/udp -p 6246:6246/udp -p 6247:6247/udp -p 8883:8883"
  docker port $CONTAINER_NAME
  if [ $? -eq 0 ]; then
    echo "start Cassia AC container from existing container"
    docker rename $CONTAINER_NAME ac_tmp
    docker stop ac_tmp
    docker run -d --name $CONTAINER_NAME --restart always --volumes-from ac_tmp $optPort $DOCKER_RUN_OPT $IMG_NAME $DOCKER_ENTRY
    docker rm -f ac_tmp
  else
    echo "start new Cassia AC container"
    docker run -d --name $CONTAINER_NAME --restart always $optPort $DOCKER_RUN_OPT $IMG_NAME $DOCKER_ENTRY
  fi
}

if [ "$DO_RESTART_AC" -eq 1 ]; then
  docker_run_ac
fi

exit 0
