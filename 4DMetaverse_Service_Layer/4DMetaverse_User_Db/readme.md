# 4DMetaverse_User_Db

## Env

```
DB_DSN=root:4dmetaverse-dev-mysql@tcp(127.0.0.1:3306)/4DMetaverseUser?charset=utf8mb4&parseTime=True&loc=Local
LISTEN_URL=localhost:9998
```

## Docker

```
docker pull 127.0.0.1:5000/4dmetaverse_user_db
docker stop 4dmetaverse_user_db
docker rm 4dmetaverse_user_db
docker run -d -p 9998:8080 --log-driver none --name 4dmetaverse_user_db -e DB_DSN="root:4dmetaverse-dev-mysql@tcp(host.docker.internal:3306)/4DMetaverseUser?charset=utf8mb4&parseTime=True&loc=Local" --add-host host.docker.internal:host-gateway 127.0.0.1:5000/4dmetaverse_user_db
```