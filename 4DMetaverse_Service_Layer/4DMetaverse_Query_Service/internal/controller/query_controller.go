package controller

import (
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"encoding/base64"
	"io/ioutil"
	"net/http"

	"github.com/RuiChen0101/UnifyQL_go/pkg/cache"
	"github.com/RuiChen0101/UnifyQL_go/pkg/service_config"
	"github.com/RuiChen0101/UnifyQL_go/pkg/unifyql"
	"github.com/gin-gonic/gin"
)

type queryApiHandler struct {
	unifyQl   unifyql.UnifyQl
	planCache cache.ExecutionPlanCache
}

func RegisterQueryApi(
	engine *gin.Engine,
	configSource service_config.ServiceConfigSource,
	httpClient utility.HttpClient,
	redisClient utility.RedisClient,
) {
	planCache := unifyql_custom.NewRedisPlanCache(redisClient)
	h := queryApiHandler{
		planCache: planCache,
		unifyQl: unifyql.NewUnifyQl(
			configSource,
			unifyql_custom.NewCustomFetchProxy(httpClient),
			planCache,
		),
	}

	queryGroup := engine.Group("/query")
	queryGroup.POST("", h.query)
}

func (h *queryApiHandler) query(c *gin.Context) {
	buffer, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	req := string(buffer)
	queryBuf, _ := base64.StdEncoding.DecodeString(req)
	query := string(queryBuf)

	result, err := h.unifyQl.Query(query)

	if err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, result)
}
