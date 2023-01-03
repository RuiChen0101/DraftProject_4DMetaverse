package main

import (
	"4dmetaverse/user_db/internal/controller"
	"4dmetaverse/user_db/internal/repository"
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/internal/utility"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	engine := gin.Default()
	db := utility.NewDatabaseConnection()

	repoManager := repository.NewRepoManager(db)
	serviceManager := service.NewServiceManager(&repoManager)

	controller.RegisterUserApi(engine, &serviceManager)
	controller.RegisterWeb3Wallet(engine, &serviceManager)
	controller.RegisterVerifySmsApi(engine, &serviceManager)
	controller.RegisterLoginDeviceApi(engine, &serviceManager)

	controller.RegisterSystemApi(engine)
	controller.RegisterQueryApi(engine, db, &serviceManager)

	listen := os.Getenv("LISTEN_URL")
	engine.Run(listen)
}
