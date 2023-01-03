package main

import (
	"4dmetaverse/storage_service/internal/controller"
	"4dmetaverse/storage_service/internal/repository"
	"4dmetaverse/storage_service/internal/service"
	"4dmetaverse/storage_service/internal/utility"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	engine := gin.Default()
	engine.UseRawPath = true
	engine.UnescapePathValues = false
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Authorization"}
	engine.Use(cors.New(corsConfig))

	db := utility.NewDatabaseConnection()

	repoManager := repository.NewRepoManager(db)
	serviceManager := service.NewServiceManager(repoManager)

	controller.RegisterFileApi(engine, serviceManager)
	controller.RegisterDirectoryApi(engine, serviceManager)
	controller.RegisterQueryApi(engine, db, serviceManager)
	controller.RegisterSystemApi(engine)

	listen := os.Getenv("LISTEN_URL")
	engine.Run(listen)
}
