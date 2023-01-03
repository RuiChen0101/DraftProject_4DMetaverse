package controller_test

import (
	"4dmetaverse/main_db/internal/controller"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/suite"
)

type SystemControllerTestSuite struct {
	suite.Suite
	engine *gin.Engine
}

func (sct *SystemControllerTestSuite) SetupSuite() {
	engine := gin.Default()

	controller.RegisterSystemApi(engine)

	sct.engine = engine
}

func (sct *SystemControllerTestSuite) TestGetStatus() {
	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/system/status", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"status\":\"OK\",\"version\":\"0.1.0\"}", r.Body.String())
}

func (sct *SystemControllerTestSuite) TestServiceConfig() {
	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/system/serviceConfig", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"dbName\":\"4DMetaverseMain\",\"serviceName\":\"mainDb\",\"tables\":[\"series\",\"shop\",\"shop_image\",\"collection\",\"collection_pool\",\"sale_plan\",\"unlocked_collection\"]}", r.Body.String())
}

func TestSystemController(t *testing.T) {
	suite.Run(t, new(SystemControllerTestSuite))
}
