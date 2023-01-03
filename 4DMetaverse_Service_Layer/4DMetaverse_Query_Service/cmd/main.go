package main

import (
	"4dmetaverse/query_service/internal/controller"
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"context"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	engine := gin.Default()

	httpClient := utility.NewDefaultHttpClient()
	redisClient := utility.NewDefaultRedisClient(context.Background(), 15)
	configSource := unifyql_custom.NewNetworkConfigSource(httpClient)

	controller.RegisterQueryApi(engine, configSource, httpClient, redisClient)
	controller.RegisterSystemApi(engine, configSource, httpClient)

	listen := os.Getenv("LISTEN_URL")
	engine.Run(listen)
}
