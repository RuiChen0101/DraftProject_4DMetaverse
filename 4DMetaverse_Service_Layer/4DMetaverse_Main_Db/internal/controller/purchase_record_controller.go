package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type purchaseRecordApiHandler struct {
	purchaseRecordService service.PurchaseRecordService
}

func RegisterPurchaseRecordApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := purchaseRecordApiHandler{
		purchaseRecordService: service.GetService[service.PurchaseRecordService](sm, "purchase_record"),
	}

	group := engine.Group("/purchaseRecord")
	group.POST("/create", h.create)
}

func (h *purchaseRecordApiHandler) create(c *gin.Context) {
	purchaseRecordDto := service.PurchaseRecordCreateDTO{}
	if err := c.ShouldBindJSON(&purchaseRecordDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	purchaseRecord, err := h.purchaseRecordService.CreateEntity(purchaseRecordDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, purchaseRecord)
}
