package controller_test

import (
	"4dmetaverse/user_db/internal/controller"
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/test/mocks"
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type Web3WalletControllerTestSuite struct {
	suite.Suite
	web3WalletService *mocks.MockWeb3WalletService
	engine            *gin.Engine
}

func (wwt *Web3WalletControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(wwt.T())
	defer ctrl.Finish()
	wwt.web3WalletService = mocks.NewMockWeb3WalletService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"web3_wallet": wwt.web3WalletService,
	})

	engine := gin.Default()
	controller.RegisterWeb3Wallet(engine, sm)
	wwt.engine = engine
}

func (wwt *Web3WalletControllerTestSuite) TestCreate() {
	wwt.web3WalletService.EXPECT().CreateEntity(service.Web3WalletCreateDTO{
		UserId: "1234-5678-90ab-cdef",
	}).Return(&entity.Web3Wallet{Id: 1}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/web3Wallet/create", bytes.NewBufferString("{\"userId\":\"1234-5678-90ab-cdef\"}"))
	wwt.engine.ServeHTTP(r, req)

	wwt.Equal(http.StatusOK, r.Code)
	wwt.Equal("{\"id\":1,\"userId\":\"\",\"type\":\"\",\"address\":\"\",\"nonce\":\"\",\"createAt\":null}", r.Body.String())
}

func (wwt *Web3WalletControllerTestSuite) TestCreateFail() {
	wwt.web3WalletService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/web3Wallet/create", bytes.NewBufferString("{\"userId\":\"1234-5678-90ab-cdef\"}"))
	wwt.engine.ServeHTTP(r, req)

	wwt.Equal(http.StatusBadRequest, r.Code)
}

func (wwt *Web3WalletControllerTestSuite) TestGetByAddress() {
	wwt.web3WalletService.EXPECT().GetEntityByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55").Return(&entity.Web3Wallet{
		Address: "0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/web3Wallet/get/address/0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55", nil)
	wwt.engine.ServeHTTP(r, req)

	wwt.Equal(http.StatusOK, r.Code)
	wwt.Equal("{\"id\":0,\"userId\":\"\",\"type\":\"\",\"address\":\"0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55\",\"nonce\":\"\",\"createAt\":null}", r.Body.String())
}

func (wwt *Web3WalletControllerTestSuite) TestGetByAddressFail() {
	wwt.web3WalletService.EXPECT().GetEntityByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55").Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/web3Wallet/get/address/0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55", nil)
	wwt.engine.ServeHTTP(r, req)

	wwt.Equal(http.StatusBadRequest, r.Code)
	wwt.Equal("fail", r.Body.String())
}

func TestWeb3WalletController(t *testing.T) {
	suite.Run(t, new(Web3WalletControllerTestSuite))
}
