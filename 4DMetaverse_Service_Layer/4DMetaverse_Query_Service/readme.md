# 4DMetaverse_Query_Service

## Env

```
LISTEN_URL=:9990
REDIS_ADDR=192.168.68.146:6379
MAIN_DB_URL=http://192.168.68.146:9999
USER_DB_URL=http://192.168.68.146:9998
STORAGE_SERVICE_URL=http://192.168.68.146:9997
```

## Docker

```
docker pull 192.168.68.167:5000/4dmetaverse_query_service
docker stop 4dmetaverse_query_service
docker rm 4dmetaverse_query_service
docker run -d -p 9990:8080 --log-driver none --name 4dmetaverse_query_service -e REDIS_ADDR="host.docker.internal:6379" -e STORAGE_SERVICE_URL="http://host.docker.internal:9997" -e USER_DB_URL="http://host.docker.internal:9998" -e MAIN_DB_URL="http://host.docker.internal:9999" --add-host host.docker.internal:host-gateway 192.168.68.167:5000/4dmetaverse_query_service
```