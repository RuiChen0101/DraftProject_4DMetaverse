package controller

import (
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type verifySmsApiHandler struct {
	verifySmsService service.VerifySmsService
}

func RegisterVerifySmsApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := verifySmsApiHandler{
		verifySmsService: service.GetService[service.VerifySmsService](sm, "verify_sms"),
	}

	recordGroup := engine.Group("/verifySms")
	recordGroup.POST("/create", h.create)
	recordGroup.PUT("/updateUsed/:phone/:verifyCode", h.updateUsed)
}

func (h *verifySmsApiHandler) create(c *gin.Context) {
	recordDto := service.VerifySmsCreateDTO{}
	if err := c.ShouldBindJSON(&recordDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	record, err := h.verifySmsService.CreateEntity(recordDto)

	if err != nil {
		if err.Error() == "Conflict" {
			c.Data(http.StatusConflict, "text/plain; charset=utf-8", []byte(err.Error()))
			return
		}
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *verifySmsApiHandler) updateUsed(c *gin.Context) {
	phone := c.Param("phone")
	verifyCode := c.Param("verifyCode")

	if err := h.verifySmsService.UpdateCodeUsed(phone, verifyCode); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
