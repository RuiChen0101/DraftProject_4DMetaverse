package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type shopGroupApiHandler struct {
	shopGroupService service.ShopGroupService
}

func RegisterShopGroupApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := shopGroupApiHandler{
		shopGroupService: service.GetService[service.ShopGroupService](sm, "shop_group"),
	}

	group := engine.Group("/shopGroup")
	group.POST("/create", h.create)
	group.PUT("/:id/update", h.update)
	group.DELETE("/:id/delete", h.delete)
}

func (h *shopGroupApiHandler) create(c *gin.Context) {
	shopGroupDto := service.ShopGroupCreateDTO{}
	if err := c.ShouldBindJSON(&shopGroupDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shopGroup, err := h.shopGroupService.CreateEntity(shopGroupDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shopGroup)
}

func (h *shopGroupApiHandler) update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shopGroupDto := service.ShopGroupUpdateDTO{}
	if err := c.ShouldBindJSON(&shopGroupDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shopGroup, err := h.shopGroupService.UpdateEntity(id, shopGroupDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shopGroup)
}

func (h *shopGroupApiHandler) delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.shopGroupService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
