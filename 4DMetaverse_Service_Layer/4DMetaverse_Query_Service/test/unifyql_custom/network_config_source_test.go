package unifyql_custom_test

import (
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"4dmetaverse/query_service/test/mocks"
	"os"
	"testing"

	"github.com/RuiChen0101/UnifyQL_go/pkg/service_config"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type NetworkConfigSourceTestSuite struct {
	suite.Suite
	httpClient   *mocks.MockHttpClient
	configSource *unifyql_custom.NetworkConfigSource
}

func (nct *NetworkConfigSourceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(nct.T())
	defer ctrl.Finish()
	nct.httpClient = mocks.NewMockHttpClient(ctrl)

	nct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9999/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseMain\",\"serviceName\":\"mainDb\",\"tables\":[\"collection\"]}"),
	}, nil)
	nct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9998/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseUser\",\"serviceName\":\"userDb\",\"tables\":[\"user\"]}"),
	}, nil)
	nct.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "GET",
		Url:    "http://localhost:9997/system/serviceConfig",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("{\"dbName\":\"4DMetaverseStorage\",\"serviceName\":\"storageService\",\"tables\":[\"file\"]}"),
	}, nil)

	os.Setenv("MAIN_DB_URL", "http://localhost:9999")
	os.Setenv("USER_DB_URL", "http://localhost:9998")
	os.Setenv("STORAGE_SERVICE_URL", "http://localhost:9997")

	nct.configSource = unifyql_custom.NewNetworkConfigSource(nct.httpClient)
}

func (nct *NetworkConfigSourceTestSuite) TestGetTableMapping() {
	nct.EqualValues(map[string]string{
		"collection": "mainDb",
		"file":       "storageService",
		"user":       "userDb",
	}, nct.configSource.GetTableMapping())
}

func (nct *NetworkConfigSourceTestSuite) TestGetServiceConfig() {
	nct.EqualValues(map[string]service_config.ServiceConfig{
		"mainDb": {
			ServiceName: "mainDb",
			Url:         "http://localhost:9999",
			Tables:      []string{"collection"},
		},
		"userDb": {
			ServiceName: "userDb",
			Url:         "http://localhost:9998",
			Tables:      []string{"user"},
		},
		"storageService": {
			ServiceName: "storageService",
			Url:         "http://localhost:9997",
			Tables:      []string{"file"},
		},
	}, nct.configSource.GetServiceConfigs())
}

func TestNetworkConfigSource(t *testing.T) {
	suite.Run(t, new(NetworkConfigSourceTestSuite))
}
