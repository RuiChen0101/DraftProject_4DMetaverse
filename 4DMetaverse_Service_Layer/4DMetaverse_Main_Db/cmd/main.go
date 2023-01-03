package main

import (
	"4dmetaverse/main_db/internal/controller"
	"4dmetaverse/main_db/internal/repository"
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	engine := gin.Default()
	db := utility.NewDatabaseConnection()

	repoManager := repository.NewRepoManager(db)
	serviceManager := service.NewServiceManager(repoManager)

	controller.RegisterShopGroupApi(engine, serviceManager)
	controller.RegisterShopApi(engine, serviceManager)
	controller.RegisterShopImageApi(engine, serviceManager)
	controller.RegisterSalePlanApi(engine, serviceManager)
	controller.RegisterPurchaseRecordApi(engine, serviceManager)
	controller.RegisterCollectionPoolApi(engine, serviceManager)
	controller.RegisterCollectionApi(engine, serviceManager)
	controller.RegisterUnlockedCollectionApi(engine, serviceManager)
	controller.RegisterQueryApi(engine, db, serviceManager)
	controller.RegisterSystemApi(engine)

	listen := os.Getenv("LISTEN_URL")
	engine.Run(listen)
}
