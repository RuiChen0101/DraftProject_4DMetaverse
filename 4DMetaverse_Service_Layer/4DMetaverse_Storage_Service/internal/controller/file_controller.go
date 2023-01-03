package controller

import (
	"4dmetaverse/storage_service/internal/entity"
	"4dmetaverse/storage_service/internal/service"
	"4dmetaverse/storage_service/internal/utility"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type fileApiHandler struct {
	fileService         service.FileService
	directoryService    service.DirectoryService
	accessRecordService service.AccessRecordService
}

func RegisterFileApi(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := fileApiHandler{
		fileService:         service.GetService[service.FileService](sm, "file"),
		accessRecordService: service.GetService[service.AccessRecordService](sm, "access_record"),
		directoryService:    service.GetService[service.DirectoryService](sm, "directory"),
	}

	group := engine.Group("/file")
	group.POST("/create", h.create)
	group.POST("/upload", h.upload)
	group.PUT("/:id/update", h.update)
	group.PUT("/:id/delayedUpload", h.delayedUpload)
	group.GET("/:value", h.get)
	group.GET("/:value/metadata", h.metadata)
	group.GET("/list/dirId/:dirId", h.listByDirId)
	group.GET("/list/pathPrefix/:path", h.listByPathPrefix)
	group.DELETE("/:value/delete", h.delete)
}

func (h *fileApiHandler) create(c *gin.Context) {
	fileDto := service.FileCreateDTO{}
	if err := c.ShouldBindJSON(&fileDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if fileDto.StorePath == "" {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte("FileUpdate: cannot store without directory"))
		return
	}

	dirId, err := h.directoryService.EnsurePath(fileDto.StorePath)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	fileDto.DirectoryId = dirId

	file, err := h.fileService.CreateEntity(fileDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, file)
}

func (h *fileApiHandler) upload(c *gin.Context) {
	storePath := c.PostForm("path")
	supplementDataStr := c.PostForm("supplementData")
	createBy := c.PostForm("createBy")

	file, err := c.FormFile("file")
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if storePath == "" {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte("FileUpdate: cannot store without directory"))
		return
	}

	dirId, err := h.directoryService.EnsurePath(storePath)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	var supplementData map[string]interface{}
	jsonErr := json.Unmarshal([]byte(supplementDataStr), &supplementData)
	saveDto := service.FileSaveDTO{
		File:           file,
		StorePath:      storePath,
		DirectoryId:    dirId,
		SupplementData: make(map[string]interface{}),
		CreateBy:       createBy,
	}
	if jsonErr == nil {
		saveDto.SupplementData = supplementData
	}

	fileEntity, err := h.fileService.Save(saveDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, fileEntity)
}

func (h *fileApiHandler) update(c *gin.Context) {
	id := c.Param("id")

	fileDto := service.FileUpdateDTO{}
	if err := c.ShouldBindJSON(&fileDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	file, err := h.fileService.UpdateEntity(id, fileDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, file)
}

func (h *fileApiHandler) delayedUpload(c *gin.Context) {
	id := c.Param("id")
	updateBy := c.PostForm("updateBy")

	file, err := c.FormFile("file")
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	swapDto := service.FileSwapDTO{
		File:     file,
		UpdateBy: updateBy,
	}

	fileEntity, err := h.fileService.Swap(id, swapDto)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, fileEntity)
}

func (h *fileApiHandler) get(c *gin.Context) {
	value, err := url.QueryUnescape(c.Param("value"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	var file *entity.File
	if strings.Contains(value, "/") {
		file, err = h.fileService.GetEntityByPath(value)
	} else {
		file, err = h.fileService.GetEntity(value)
	}

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if file.Permission == -1 {
		h.accessRecordService.Create(service.AccessRecordCreateDto{
			FileId: file.Id,
			Result: -1,
		})
		c.Data(http.StatusForbidden, "text/plain; charset=utf-8", []byte("FileGet: permission deny"))
	}

	h.accessRecordService.Create(service.AccessRecordCreateDto{
		FileId: file.Id,
		Result: 1,
	})
	c.Header("Content-Disposition", fmt.Sprintf("inline; filename=%s.%s", file.Name, file.Extension))
	c.Header("Content-Type", file.MimeType)
	c.File(file.StoreLocation)
}

func (h *fileApiHandler) metadata(c *gin.Context) {
	value, err := url.QueryUnescape(c.Param("value"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	var file *entity.File
	if strings.Contains(value, "/") {
		file, err = h.fileService.GetEntityByPath(value)
	} else {
		file, err = h.fileService.GetEntity(value)
	}

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, file)
}

func (h *fileApiHandler) listByDirId(c *gin.Context) {
	dirId, err := strconv.ParseUint(c.Param("dirId"), 0, 64)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	files, err := h.fileService.GetEntitiesByDirId(dirId)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, files)
}

func (h *fileApiHandler) listByPathPrefix(c *gin.Context) {
	path, err := url.QueryUnescape(c.Param("path"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	files, err := h.fileService.GetEntitiesByPathPrefix(path)
	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, files)
}

func (h *fileApiHandler) delete(c *gin.Context) {
	value, err := url.QueryUnescape(c.Param("value"))
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if strings.Contains(value, "/") {
		err = h.fileService.DeleteEntityByPath(value)
	} else {
		err = h.fileService.DeleteEntity(value)
	}

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.Status(http.StatusNoContent)
}
