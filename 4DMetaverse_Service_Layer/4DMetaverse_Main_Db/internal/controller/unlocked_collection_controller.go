package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type unlockedCollectionApiHandler struct {
	unlockedCollectionService service.UnlockedCollectionService
}

func RegisterUnlockedCollectionApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := unlockedCollectionApiHandler{
		unlockedCollectionService: service.GetService[service.UnlockedCollectionService](sm, "unlocked_collection"),
	}

	group := engine.Group("/unlockedCollection")
	group.POST("/create", h.create)
	group.DELETE("/:id/delete", h.delete)
}

func (h *unlockedCollectionApiHandler) create(c *gin.Context) {
	unlockedCollectionDto := service.UnlockedCollectionCreateDTO{}
	if err := c.ShouldBindJSON(&unlockedCollectionDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	unlockedCollection, err := h.unlockedCollectionService.CreateEntity(unlockedCollectionDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, unlockedCollection)
}

func (h *unlockedCollectionApiHandler) delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.unlockedCollectionService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
