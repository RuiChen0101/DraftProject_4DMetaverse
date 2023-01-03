package controller_test

import (
	"4dmetaverse/query_service/internal/controller"
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"4dmetaverse/query_service/test/mocks"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type SystemControllerTestSuite struct {
	suite.Suite
	httpClient   *mocks.MockHttpClient
	configSource *unifyql_custom.NetworkConfigSource
	engine       *gin.Engine
}

func (sct *SystemControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sct.T())
	defer ctrl.Finish()
	sct.httpClient = mocks.NewMockHttpClient(ctrl)
	sct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9999/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseMain\",\"serviceName\":\"mainDb\",\"tables\":[]}"),
	}, nil)
	sct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9998/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseUser\",\"serviceName\":\"userDb\",\"tables\":[]}"),
	}, nil)
	sct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9997/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseStorage\",\"serviceName\":\"fileService\",\"tables\":[]}"),
	}, nil)

	os.Setenv("MAIN_DB_URL", "http://localhost:9999")
	os.Setenv("USER_DB_URL", "http://localhost:9998")
	os.Setenv("STORAGE_SERVICE_URL", "http://localhost:9997")
	sct.configSource = unifyql_custom.NewNetworkConfigSource(sct.httpClient)
	sct.EqualValues([]string{}, sct.configSource.GetServiceConfigs()["userDb"].Tables)

	engine := gin.Default()
	controller.RegisterSystemApi(engine, sct.configSource, sct.httpClient)
	sct.engine = engine
}

func (sct *SystemControllerTestSuite) TestSystemStatus() {
	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/system/status", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"status\":\"OK\",\"version\":\"0.1.0\"}", r.Body.String())
}

func (sct *SystemControllerTestSuite) TestServiceUpdate() {
	sct.httpClient.EXPECT().Request(gomock.Any()).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseUser\",\"serviceName\":\"userDb\",\"tables\":[\"user\",\"login_device\",\"web3_wallet\",\"verify_sms\"]}"),
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/system/serviceUpdate/userDb", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNoContent, r.Code)
	sct.EqualValues([]string{"user", "login_device", "web3_wallet", "verify_sms"}, sct.configSource.GetServiceConfigs()["userDb"].Tables)
}

func (sct *SystemControllerTestSuite) TestServiceUpdateNotDefinedFail() {
	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/system/serviceUpdate/ndService", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusBadRequest, r.Code)
	sct.Equal("NetworkConfigSource: update fail - ndService not defined", r.Body.String())
}

func TestSystemController(t *testing.T) {
	suite.Run(t, new(SystemControllerTestSuite))
}
