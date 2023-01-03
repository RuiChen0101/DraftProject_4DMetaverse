package unifyql_custom_test

import (
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/internal/utility"
	"4dmetaverse/query_service/test/mocks"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type CustomFetchProxyTestSuite struct {
	suite.Suite
	httpClient *mocks.MockHttpClient
}

func (cft *CustomFetchProxyTestSuite) SetupSuite() {
	ctrl := gomock.NewController(cft.T())
	defer ctrl.Finish()
	cft.httpClient = mocks.NewMockHttpClient(ctrl)
}

func (cft *CustomFetchProxyTestSuite) TestInternalRequest() {
	cft.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "POST",
		Url:    "http://localhost:9998/query/raw",
		Header: map[string]string{
			"Content-Type": "text/plain",
		},
		Body: "UVVFUlkgdXNlcg==",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("[{\"id\":\"id\"}]"),
	}, nil)

	fetch := unifyql_custom.NewCustomFetchProxy(cft.httpClient)

	res, err := fetch.Request("01234567", "http://localhost:9998", "QUERY user")

	cft.Nil(err)
	cft.Equal([]byte("[{\"id\":\"id\"}]"), res)
}

func (cft *CustomFetchProxyTestSuite) TestRootRequest() {
	cft.httpClient.EXPECT().Request(gomock.Eq(utility.HttpRequest{
		Method: "POST",
		Url:    "http://localhost:9998/query",
		Header: map[string]string{
			"Content-Type": "text/plain",
		},
		Body: "UVVFUlkgdXNlcg==",
	})).Return(&utility.HttpResponse{
		StatusCode: 200,
		Body:       []byte("[{\"id\":\"id\"}]"),
	}, nil)

	fetch := unifyql_custom.NewCustomFetchProxy(cft.httpClient)

	res, err := fetch.Request("root", "http://localhost:9998", "QUERY user")

	cft.Nil(err)
	cft.Equal([]byte("[{\"id\":\"id\"}]"), res)
}

func (cft *CustomFetchProxyTestSuite) TestResponse404() {
	cft.httpClient.EXPECT().Request(gomock.Any()).Return(&utility.HttpResponse{
		StatusCode: 404,
		Body:       []byte(""),
	}, nil)

	fetch := unifyql_custom.NewCustomFetchProxy(cft.httpClient)

	res, err := fetch.Request("01234567", "http://localhost:9998", "QUERY user")

	cft.Nil(err)
	cft.Equal([]byte("[]"), res)
}

func (cft *CustomFetchProxyTestSuite) TestResponseOther() {
	cft.httpClient.EXPECT().Request(gomock.Any()).Return(&utility.HttpResponse{
		StatusCode: 500,
		Body:       []byte(""),
	}, nil)

	fetch := unifyql_custom.NewCustomFetchProxy(cft.httpClient)

	res, err := fetch.Request("01234567", "http://localhost:9998", "QUERY user")

	cft.Equal("FetchProxy: http://localhost:9998 response 500 when executing QUERY user", err.Error())
	cft.Nil(res)
}

func TestCustomFetchProxy(t *testing.T) {
	suite.Run(t, new(CustomFetchProxyTestSuite))
}
