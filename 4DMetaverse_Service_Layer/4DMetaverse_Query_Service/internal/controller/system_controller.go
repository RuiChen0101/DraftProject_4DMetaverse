package controller

import (
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type systemApiHandler struct {
	configSource *unifyql_custom.NetworkConfigSource
	httpClient   utility.HttpClient
}

func RegisterSystemApi(
	gin *gin.Engine,
	configSource *unifyql_custom.NetworkConfigSource,
	httpClient utility.HttpClient,
) {
	h := systemApiHandler{
		configSource: configSource,
		httpClient:   httpClient,
	}

	systemGroup := gin.Group("/system")
	systemGroup.GET("/status", h.status)
	systemGroup.GET("/serviceUpdate/:serviceName", h.serviceUpdate)
}

func (h *systemApiHandler) status(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "OK",
		"version": "0.1.0",
	})
}

func (h *systemApiHandler) serviceUpdate(c *gin.Context) {
	serviceName := c.Param("serviceName")

	if err := h.configSource.RemoteTriggerUpdate(serviceName, h.httpClient); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
