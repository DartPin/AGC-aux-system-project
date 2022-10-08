# AGC-aux-system
WEB приложение для административных и производственных задач

Состоит из node+express сервера и vue+vuetify клиента

# Подготвка сборки для установки на промышленном стенде

1. Выполняем скрипт по сборке Docker образов и подготовки пакета установки
```shell
./production.sh
```

2. Копируем папку `dist` на промышленный стенд (на флешке например)

# Установка на промышленном стенде

1. На промышленном стенде копируем содержимое `dist` в любое место (например в `/opt/agc-aux`).
переходим в нужную папку `cd /opt/agc-aux`.

2. Убедимся что видим нужные файлы `ls -a`. 
Должны быть следующие папки и файлы
```
.  ..  docker-compose.yml  examples  images  install.sh
```


2. Тестовые данные

**По каким-то причинам система не стартует если нет файлов с данными**

Можно скопировать тестовые данные
```shell
mkdir app
cp -r examples/* app/
```

3. Запускаем сервисы
```shell
./install.sh
```

4. Проверяем что всё впорядке
```shell
>> docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                   NAMES
071bcf8768b5   agc-aux-web      "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp   agc-aux-web
158b4f185dcd   agc-aux-server   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   8000/tcp                                agc-aux-server
```

5. Просмотр логов

* сервер - `docker logs agc-aux-server`
* клиент - `docker logs agc-aux-web`

# Обновление на промышленном стенде
1) Через `./production.sh` собираем новые версии образов в `dist/images`.
2) Обновляем образы на промышленном стенде (например через флешку)
3) Запускаем сервисы
```shell
./install.sh
```