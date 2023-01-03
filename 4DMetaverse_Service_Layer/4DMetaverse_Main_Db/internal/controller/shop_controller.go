package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type shopApiHandler struct {
	shopService service.ShopService
}

func RegisterShopApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := shopApiHandler{
		shopService: service.GetService[service.ShopService](sm, "shop"),
	}

	group := engine.Group("/shop")
	group.POST("/create", h.create)
	group.PUT("/:id/update", h.update)
	group.DELETE("/:id/delete", h.delete)
	group.GET("/:id/get", h.get)
}

func (h *shopApiHandler) create(c *gin.Context) {
	shopDto := service.ShopCreateDTO{}
	if err := c.ShouldBindJSON(&shopDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shop, err := h.shopService.CreateEntity(shopDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shop)
}

func (h *shopApiHandler) update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shopDto := service.ShopUpdateDTO{}
	if err := c.ShouldBindJSON(&shopDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shop, err := h.shopService.UpdateEntity(id, shopDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shop)
}

func (h *shopApiHandler) delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.shopService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *shopApiHandler) get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	shop, err := h.shopService.GetEntity(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, shop)
}
