# 4DMetaverse_Main_Db

## Env

```
LISTEN_URL=:9999
DB_DSN=root:4dmetaverse-dev-mysql@tcp(192.168.68.167:3306)/4DMetaverseMain?charset=utf8mb4&parseTime=True&loc=Local
```

## Docker

```
docker pull 192.168.68.167:5000/4dmetaverse_main_db
docker stop 4dmetaverse_main_db
docker rm 4dmetaverse_main_db
docker run -d -p 9999:8080 --log-driver none --name 4dmetaverse_main_db -e DB_DSN="root:4dmetaverse-dev-mysql@tcp(host.docker.internal:3306)/4DMetaverseMain?charset=utf8mb4&parseTime=True&loc=Local" --add-host host.docker.internal:host-gateway 192.168.68.167:5000/4dmetaverse_main_db
```