#!/usr/bin/env bash

# завершать скрипт при любой ошибке
set -e

# Установка системы на промышленном стенде
HOME=$(cd `dirname $0` && pwd)
function out {
  COLOR='\033[0;35m'

  echo -e "${COLOR}[AGC]: $1${COLOR_OFF}"
}

out "Обязательно убедитесь что скрипт по завершению напишет что всё прошло успешно!"


out "Переходим в рабочую директорию ${HOME}"
cd ${HOME}

out "Загружаем последнию версию приложения"

docker load < ${HOME}/images/agc-aux-server.tar.gz
docker load < ${HOME}/images/agc-aux-web.tar.gz

out "Обновляем и запускаем последнию версию приложения"
docker compose up -d --no-deps --force-recreate --build agc-aux-server agc-aux-web

out "Приложение успешно установлено и доступно на порту 8080"
