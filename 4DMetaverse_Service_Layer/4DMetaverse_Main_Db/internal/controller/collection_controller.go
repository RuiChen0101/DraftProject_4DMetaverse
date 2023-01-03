package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type collectionApiHandler struct {
	collectionService service.CollectionService
}

func RegisterCollectionApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := collectionApiHandler{
		collectionService: service.GetService[service.CollectionService](sm, "collection"),
	}

	group := engine.Group("/collection")
	group.POST("/create", h.create)
	group.PUT("/:id/update", h.update)
	group.DELETE("/:id/delete", h.delete)
	group.GET("/:id/get", h.get)
}

func (h *collectionApiHandler) create(c *gin.Context) {
	collectionDto := service.CollectionCreateDTO{}
	if err := c.ShouldBindJSON(&collectionDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collection, err := h.collectionService.CreateEntity(collectionDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, collection)
}

func (h *collectionApiHandler) update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collectionDto := service.CollectionUpdateDTO{}
	if err := c.ShouldBindJSON(&collectionDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	collection, err := h.collectionService.UpdateEntity(id, collectionDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, collection)
}

func (h *collectionApiHandler) delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.collectionService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *collectionApiHandler) get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shop, err := h.collectionService.GetEntity(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shop)
}
