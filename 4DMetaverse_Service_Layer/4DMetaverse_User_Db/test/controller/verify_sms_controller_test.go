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

type VerifySmsControllerTestSuite struct {
	suite.Suite
	verifySmsService *mocks.MockVerifySmsService
	engine           *gin.Engine
}

func (vst *VerifySmsControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(vst.T())
	defer ctrl.Finish()
	vst.verifySmsService = mocks.NewMockVerifySmsService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"verify_sms": vst.verifySmsService,
	})

	engine := gin.Default()
	vst.engine = engine
	controller.RegisterVerifySmsApi(engine, sm)
}

func (vst *VerifySmsControllerTestSuite) TestCreate() {
	vst.verifySmsService.EXPECT().CreateEntity(service.VerifySmsCreateDTO{
		Phone:      "0912345678",
		VerifyCode: "123456",
	}).Return(&entity.VerifySms{Id: 1}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/verifySms/create", bytes.NewBufferString("{\"phone\":\"0912345678\",\"verifyCode\":\"123456\"}"))
	vst.engine.ServeHTTP(r, req)

	vst.Equal(http.StatusOK, r.Code)
	vst.Equal("{\"id\":1,\"phone\":\"\",\"verifyCode\":\"\",\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (vst *VerifySmsControllerTestSuite) TestCreateFail() {
	vst.verifySmsService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/verifySms/create", bytes.NewBufferString("{\"phone\":\"0912345678\",\"verifyCode\":\"123456\"}"))
	vst.engine.ServeHTTP(r, req)

	vst.Equal(http.StatusBadRequest, r.Code)
}

func (vst *VerifySmsControllerTestSuite) TestUpdateUsed() {
	vst.verifySmsService.EXPECT().UpdateCodeUsed("0912345678", "123456").Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/verifySms/updateUsed/0912345678/123456", nil)
	vst.engine.ServeHTTP(r, req)

	vst.Equal(http.StatusNoContent, r.Code)
}

func (vst *VerifySmsControllerTestSuite) TestUpdateUsedFail() {
	vst.verifySmsService.EXPECT().UpdateCodeUsed("0912345678", "123456").Return(errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/verifySms/updateUsed/0912345678/123456", nil)
	vst.engine.ServeHTTP(r, req)

	vst.Equal(http.StatusBadRequest, r.Code)
}

func TestVerifySmsController(t *testing.T) {
	suite.Run(t, new(VerifySmsControllerTestSuite))
}
