# 4DMetaverse_Storage_Service

## Env

```
LISTEN_URL=:9997
PUBLIC_URL=http://127.0.0.1:9997
DB_DSN=root:test-mysql@tcp(127.0.0.1:3307)/4DMetaverseStorage?charset=utf8mb4&parseTime=True&loc=Local
STORAGE_DIR=./store
```

## Docker

```
docker pull 127.0.0.1:5000/4dmetaverse_storage_service
docker stop 4dmetaverse_storage_service
docker rm 4dmetaverse_storage_service
docker run -d -p 9997:8080 --log-driver none --name 4dmetaverse_storage_service -v /home/user/Documents/file_store:/store -e DB_DSN="root:4dmetaverse-dev-mysql@tcp(host.docker.internal:3306)/4DMetaverseStorage?charset=utf8mb4&parseTime=True&loc=Local" -e PUBLIC_URL="http://127.0.0.1:9997" --add-host host.docker.internal:host-gateway 127.0.0.1:5000/4dmetaverse_storage_service
```