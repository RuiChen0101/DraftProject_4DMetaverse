package controller

import (
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type salePlanApiHandler struct {
	salePlanService service.SalePlanService
}

func RegisterSalePlanApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := salePlanApiHandler{
		salePlanService: service.GetService[service.SalePlanService](sm, "sale_plan"),
	}

	group := engine.Group("/salePlan")
	group.POST("/create", h.create)
	group.PUT("/:id/update", h.update)
	group.PUT("/:id/setCollections", h.setCollection)
	group.PUT("/:id/switchDefault", h.switchDefault)
	group.DELETE("/:id/delete", h.delete)
	group.GET("/:id/get", h.get)
}

func (h *salePlanApiHandler) create(c *gin.Context) {
	salePlanDto := service.SalePlanCreateDTO{}
	if err := c.ShouldBindJSON(&salePlanDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	salePlan, err := h.salePlanService.CreateEntity(salePlanDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, salePlan)
}

func (h *salePlanApiHandler) update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	salePlanDto := service.SalePlanUpdateDTO{}
	if err := c.ShouldBindJSON(&salePlanDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	salePlan, err := h.salePlanService.UpdateEntity(id, salePlanDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, salePlan)
}

func (h *salePlanApiHandler) setCollection(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	setCollectionDto := service.SalePlanSetCollectionsDTO{}
	if err := c.ShouldBindJSON(&setCollectionDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	err = h.salePlanService.SetCollections(id, setCollectionDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *salePlanApiHandler) switchDefault(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	err = h.salePlanService.SwitchDefault(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *salePlanApiHandler) delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if err := h.salePlanService.DeleteEntity(id); err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *salePlanApiHandler) get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	user, err := h.salePlanService.GetEntity(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, user)
}
