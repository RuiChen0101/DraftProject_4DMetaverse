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

	group := engine.Group("/system")
	group.GET("/status", h.status)
	group.GET("/serviceConfig", h.serviceConfig)
}

func (h *systemApiHandler) status(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "OK",
		"version": "0.1.0",
	})
}

func (h *systemApiHandler) serviceConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"tables": []string{
			"series",
			"shop",
			"shop_image",
			"collection",
			"collection_pool",
			"sale_plan",
			"unlocked_collection",
		},
		"dbName":      "4DMetaverseMain",
		"serviceName": "mainDb",
	})
}
