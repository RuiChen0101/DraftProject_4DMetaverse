package controller

import (
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type loginDeviceApiHandler struct {
	loginDeviceService service.LoginDeviceService
}

func RegisterLoginDeviceApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := loginDeviceApiHandler{
		loginDeviceService: service.GetService[service.LoginDeviceService](sm, "login_device"),
	}

	deviceGroup := engine.Group("/loginDevice")
	deviceGroup.POST("/create", h.create)
	deviceGroup.PUT("/:id/update", h.update)
	deviceGroup.PUT("/:id/update/refresh", h.updateRefresh)
	deviceGroup.DELETE("/:id/delete", h.delete)
}

func (h *loginDeviceApiHandler) create(c *gin.Context) {
	deviceDto := service.LoginDeviceCreateDTO{}
	if err := c.ShouldBindJSON(&deviceDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	device, err := h.loginDeviceService.CreateEntity(deviceDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, device)
}

func (h *loginDeviceApiHandler) update(c *gin.Context) {
	id := c.Param("id")

	deviceDto := service.LoginDeviceUpdateDTO{}
	if err := c.ShouldBindJSON(&deviceDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	device, err := h.loginDeviceService.UpdateEntity(id, deviceDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, device)
}

func (h *loginDeviceApiHandler) updateRefresh(c *gin.Context) {
	id := c.Param("id")

	if err := h.loginDeviceService.UpdateRefreshTime(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *loginDeviceApiHandler) delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.loginDeviceService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
