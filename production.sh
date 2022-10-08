#!/usr/bin/env bash

# Скрипт для сборки полноценного дистрибутива
HOME=$(cd `dirname $0` && pwd)
function out {
  COLOR='\033[0;35m'

  echo -e "${COLOR}[AGC]: $1${COLOR_OFF}"
}

# 1. Сборка Docker образов
out "Сборка docker образа серверной части"
сd ${HOME}/server
./devops/build.sh

out "Сборка docker образа клиентской части"
cd ${HOME}/web
./devops/build.sh

# 2. Сохранение Docker образов в файл
cd ${HOME}
out "Сохранение папки дистрибутива"
rm -rf dist
mkdir -p dist/images

docker save agc-aux-server:latest > dist/images/agc-aux-server.tar.gz
docker save agc-aux-web:latest > dist/images/agc-aux-web.tar.gz
cp ${HOME}/production/install.sh dist
cp ${HOME}/production/docker-compose.yml dist
out "Сборка выполена успешна: Используйте содержимое папки dist на промышленном стенде"

out "Копирование примеров с данными"
mkdir -p dist/examples
cp -rf ${HOME}/server/data dist/examples/
cp -rf ${HOME}/server/files dist/examples/


