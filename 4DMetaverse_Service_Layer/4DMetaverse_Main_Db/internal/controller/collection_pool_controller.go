package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type collectionPoolApiHandler struct {
	collectionPoolService service.CollectionPoolService
}

func RegisterCollectionPoolApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := collectionPoolApiHandler{
		collectionPoolService: service.GetService[service.CollectionPoolService](sm, "collection_pool"),
	}

	group := engine.Group("/collectionPool")
	group.POST("/create", h.create)
	group.PUT("/:id/update", h.update)
	group.DELETE("/:id/delete", h.delete)
}

func (h *collectionPoolApiHandler) create(c *gin.Context) {
	collectionPoolDto := service.CollectionPoolCreateDTO{}
	if err := c.ShouldBindJSON(&collectionPoolDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collectionPool, err := h.collectionPoolService.CreateEntity(collectionPoolDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, collectionPool)
}

func (h *collectionPoolApiHandler) update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collectionPoolDto := service.CollectionPoolUpdateDTO{}
	if err := c.ShouldBindJSON(&collectionPoolDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collectionPool, err := h.collectionPoolService.UpdateEntity(id, collectionPoolDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, collectionPool)
}

func (h *collectionPoolApiHandler) delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.collectionPoolService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
