package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type systemApiHandler struct{}

func RegisterSystemApi(
	engine *gin.Engine,
) {
	h := systemApiHandler{}

	systemGroup := engine.Group("/system")
	systemGroup.GET("/status", h.getStatus)
	systemGroup.GET("/serviceConfig", h.getServiceConfig)
}

func (h *systemApiHandler) getStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "OK",
		"version": "0.1.0",
	})
}

func (h *systemApiHandler) getServiceConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"tables":      []string{"user", "login_device", "web3_wallet", "verify_sms"},
		"dbName":      "4DMetaverseUser",
		"serviceName": "userDb",
	})
}
