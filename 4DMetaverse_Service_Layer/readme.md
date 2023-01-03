# 4DMetaverse_Service_Layer

## Golang test command

```sh
go test -coverprofile cover.out -coverpkg ./... ./...
go tool cover -html="cover.out"
```