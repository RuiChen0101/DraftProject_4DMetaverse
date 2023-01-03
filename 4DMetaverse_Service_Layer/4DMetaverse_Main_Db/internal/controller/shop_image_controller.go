package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type shopImageApiHandler struct {
	shopImageService service.ShopImageService
}

func RegisterShopImageApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := shopImageApiHandler{
		shopImageService: service.GetService[service.ShopImageService](sm, "shop_image"),
	}

	group := engine.Group("/shopImage")
	group.POST("/create", h.create)
	group.PUT("/:id/switchCover", h.switchCover)
	group.DELETE("/:id/delete", h.delete)
}

func (h *shopImageApiHandler) create(c *gin.Context) {
	shopImageDto := service.ShopImageCreateDTO{}
	if err := c.ShouldBindJSON(&shopImageDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shopImage, err := h.shopImageService.CreateEntity(shopImageDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shopImage)
}

func (h *shopImageApiHandler) switchCover(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	err = h.shopImageService.SwitchCover(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *shopImageApiHandler) delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.shopImageService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
