#!/usr/bin/env bash

# Скрипт для локальной сборки docker образа
# Поддерживает следующие переменные окружения:
# DOCKER_REPOSITORY - url докер репозитория. Пустой по умолчанию
# CI_DEPLOY_TAG - номер версии сборки. Если не указан собёрется :latest

set -e

DOCKER_IMAGE_NAME=agc-aux-server

COLOR_OFF='\033[0m'

function out {
  COLOR='\033[0;35m'

  echo -e "${COLOR}[AGC]: $1${COLOR_OFF}"
}

DEVOPS_FOLDER=$(cd `dirname $0` && pwd)

cd ${DEVOPS_FOLDER}/../


function build {
    if  [ -z "$DOCKER_REPOSITORY" ]
    then
      DOCKER_IMAGE=${DOCKER_IMAGE_NAME}
    else
      DOCKER_IMAGE=${DOCKER_REPOSITORY}/${DOCKER_IMAGE_NAME}
    fi

    DOCKER_JOB_IMAGE_TAG=${DOCKER_IMAGE}:${CI_DEPLOY_TAG:-latest}

    out "Build in docker $DOCKER_JOB_IMAGE_TAG"

    echo "Tag pipeline job tag"
    docker build -t $DOCKER_JOB_IMAGE_TAG .

    echo "Label latest docker tag & push"
    docker tag $DOCKER_JOB_IMAGE_TAG $DOCKER_IMAGE:latest
}

out "----------------------------------------------------"
out "Platform web:"
out ">> DOCKER_REPOSITORY= ${DOCKER_REPOSITORY}"
out ">> CI_DEPLOY_TAG= ${CI_DEPLOY_TAG}"


build

echo "Docker build tag ${CI_DEPLOY_TAG}"

export status=0

# below is only cleanup
# ignore errors - we successfully deployed dockers
set +e

exit $status
