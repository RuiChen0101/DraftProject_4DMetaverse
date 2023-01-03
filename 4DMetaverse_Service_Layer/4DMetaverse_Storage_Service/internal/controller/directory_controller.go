package controller

import (
	"4dmetaverse/storage_service/internal/entity"
	"4dmetaverse/storage_service/internal/service"
	"4dmetaverse/storage_service/internal/utility"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
)

type directoryApiHandler struct {
	directoryService service.DirectoryService
}

func RegisterDirectoryApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := directoryApiHandler{
		directoryService: service.GetService[service.DirectoryService](sm, "directory"),
	}

	group := engine.Group("/directory")
	group.POST("/ensurePath", h.ensurePath)
	group.PUT("/:id/update", h.update)
	group.GET("/:id/get", h.get)
	group.GET("/list/parentId/:parentId", h.listByParentId)
	group.GET("/list/pathPrefix/:path", h.listByPathPrefix)
	group.DELETE("/:id/delete", h.delete)
}

func (h *directoryApiHandler) ensurePath(c *gin.Context) {
	dirDto := service.DirectoryEnsurePathDTO{}
	if err := c.ShouldBindJSON(&dirDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	_, err := h.directoryService.EnsurePath(dirDto.Path)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *directoryApiHandler) update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	dirDto := service.DirectoryUpdateDTO{}
	if err := c.ShouldBindJSON(&dirDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	_, err = h.directoryService.UpdateEntity(id, dirDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *directoryApiHandler) get(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	file, err := h.directoryService.GetEntity(id)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, file)
}

func (h *directoryApiHandler) listByParentId(c *gin.Context) {
	parentId, err := strconv.ParseUint(c.Param("parentId"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	var dirs []entity.Directory
	if parentId == 0 {
		dirs, err = h.directoryService.GetEntitiesByParentId(nil)
	} else {
		dirs, err = h.directoryService.GetEntitiesByParentId(&parentId)
	}
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, dirs)
}

func (h *directoryApiHandler) listByPathPrefix(c *gin.Context) {
	path, err := url.QueryUnescape(c.Param("path"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	dirs, err := h.directoryService.GetEntitiesByPathPrefix(path)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, dirs)
}

func (h *directoryApiHandler) delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	err = h.directoryService.DeleteEntity(id)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
