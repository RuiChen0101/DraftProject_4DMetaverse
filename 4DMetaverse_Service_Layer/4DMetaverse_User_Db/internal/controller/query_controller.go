package controller

import (
	"4dmetaverse/user_db/internal/service"
	"encoding/base64"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/RuiChen0101/UnifyQL_go/pkg/converter"
	"github.com/RuiChen0101/UnifyQL_go/pkg/element"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type queryApiHandler struct {
	sm *service.ServiceManager
	db *gorm.DB
}

func RegisterQueryApi(
	engine *gin.Engine,
	db *gorm.DB,
	sm *service.ServiceManager,
) {
	h := queryApiHandler{
		sm: sm,
		db: db,
	}

	queryGroup := engine.Group("/query")
	queryGroup.POST("", h.queryAndWrap)
	queryGroup.POST("/raw", h.queryRaw)
}

func (h *queryApiHandler) queryAndWrap(c *gin.Context) {
	buffer, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	req := string(buffer)
	queryBuf, _ := base64.StdEncoding.DecodeString(req)
	query := string(queryBuf)

	el, err := element.ExtractElement(query)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	sql, err := converter.ConvertToSQLByElement(el)

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	if el.Operation == element.UnifyQLOperation.Query {
		service := service.GetService[service.Service](h.sm, el.QueryTarget)
		result := service.GetEntitiesBySQL(sql)
		c.JSON(http.StatusOK, result)
	} else {
		result := []map[string]interface{}{}
		h.db.Raw(sql).Scan(&result)
		c.JSON(http.StatusOK, result)
	}
}

func (h *queryApiHandler) queryRaw(c *gin.Context) {
	buffer, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}
	req := string(buffer)
	query, _ := base64.StdEncoding.DecodeString(req)
	queryStr := string(query)
	if ok := strings.HasPrefix(queryStr, "SELECT"); !ok {
		sql, err := converter.ConvertToSQL(queryStr)
		if err != nil {
			c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
			return
		}
		queryStr = sql
	}
	result := []map[string]interface{}{}
	h.db.Raw(queryStr).Scan(&result)
	c.JSON(http.StatusOK, result)
}
