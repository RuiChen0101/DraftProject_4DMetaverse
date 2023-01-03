package controller

import (
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type userApiHandler struct {
	userService service.UserService
}

func RegisterUserApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := userApiHandler{
		userService: service.GetService[service.UserService](sm, "user"),
	}

	userGroup := engine.Group("/user")
	userGroup.POST("/create", h.create)
	userGroup.PUT("/:id/update", h.update)
	userGroup.GET("/:id/get", h.get)
	userGroup.GET("/get/email/:email", h.getByEmail)
}

func (h *userApiHandler) create(c *gin.Context) {
	userDto := service.UserCreateDTO{}
	if err := c.ShouldBindJSON(&userDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	user, err := h.userService.CreateEntity(userDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *userApiHandler) update(c *gin.Context) {
	id := c.Param("id")

	userDto := service.UserUpdateDTO{}
	if err := c.ShouldBindJSON(&userDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	user, err := h.userService.UpdateEntity(id, userDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *userApiHandler) get(c *gin.Context) {
	id := c.Param("id")

	user, err := h.userService.GetEntity(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *userApiHandler) getByEmail(c *gin.Context) {
	email := c.Param("email")

	user, err := h.userService.GetEntityByEmail(email)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, user)
}
