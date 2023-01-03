package controller_test

import (
	"4dmetaverse/user_db/internal/controller"
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/test/mocks"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type LoginDeviceControllerTestSuite struct {
	suite.Suite
	loginDeviceService *mocks.MockLoginDeviceService
	engine             *gin.Engine
}

func (ldt *LoginDeviceControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(ldt.T())
	defer ctrl.Finish()
	ldt.loginDeviceService = mocks.NewMockLoginDeviceService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"login_device": ldt.loginDeviceService,
	})

	engine := gin.Default()
	controller.RegisterLoginDeviceApi(engine, sm)
	ldt.engine = engine
}

func (ldt *LoginDeviceControllerTestSuite) TestCreate() {
	ldt.loginDeviceService.EXPECT().CreateEntity(service.LoginDeviceCreateDTO{
		Id: "1234567890abcdefghijklmo",
	}).Return(&entity.LoginDevice{Id: "1234567890abcdefghijklmo"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/loginDevice/create", bytes.NewBufferString("{\"id\":\"1234567890abcdefghijklmo\"}"))
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusOK, r.Code)
	ldt.Equal("{\"id\":\"1234567890abcdefghijklmo\",\"userId\":\"\",\"deviceType\":0,\"createAt\":null,\"refreshAt\":null}", r.Body.String())
}

func (ldt *LoginDeviceControllerTestSuite) TestCreateFail() {
	ldt.loginDeviceService.EXPECT().CreateEntity(gomock.Any()).Return(nil, &mysql.MySQLError{Number: 1062})

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/loginDevice/create", bytes.NewBufferString("{}"))
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusConflict, r.Code)
}

func (ldt *LoginDeviceControllerTestSuite) TestUpdate() {
	ldt.loginDeviceService.EXPECT().UpdateEntity("1234567890abcdefghijklmo", service.LoginDeviceUpdateDTO{
		FirebaseToken: "firebase token",
	}).Return(&entity.LoginDevice{Id: "1234567890abcdefghijklmo"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/loginDevice/1234567890abcdefghijklmo/update", bytes.NewBufferString("{\"firebaseToken\":\"firebase token\"}"))
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusOK, r.Code)
	ldt.Equal("{\"id\":\"1234567890abcdefghijklmo\",\"userId\":\"\",\"deviceType\":0,\"createAt\":null,\"refreshAt\":null}", r.Body.String())
}

func (ldt *LoginDeviceControllerTestSuite) TestUpdateFail() {
	ldt.loginDeviceService.EXPECT().UpdateEntity("1234567890abcdefghijklmo", gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/loginDevice/1234567890abcdefghijklmo/update", bytes.NewBufferString("{\"firebaseToken\":\"firebase token\"}"))
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusNotFound, r.Code)
}

func (ldt *LoginDeviceControllerTestSuite) TestUpdateRefresh() {
	ldt.loginDeviceService.EXPECT().UpdateRefreshTime("1234567890abcdefghijklmo").Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/loginDevice/1234567890abcdefghijklmo/update/refresh", nil)
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusNoContent, r.Code)
}

func (ldt *LoginDeviceControllerTestSuite) TestUpdateRefreshFail() {
	ldt.loginDeviceService.EXPECT().UpdateRefreshTime("1234567890abcdefghijklmo").Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/loginDevice/1234567890abcdefghijklmo/update/refresh", nil)
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusNotFound, r.Code)
}

func (ldt *LoginDeviceControllerTestSuite) TestDelete() {
	ldt.loginDeviceService.EXPECT().DeleteEntity("1234567890abcdefghijklmo").Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/loginDevice/1234567890abcdefghijklmo/delete", nil)
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusNoContent, r.Code)
}

func (ldt *LoginDeviceControllerTestSuite) TestDeleteFail() {
	ldt.loginDeviceService.EXPECT().DeleteEntity("1234567890abcdefghijklmo").Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/loginDevice/1234567890abcdefghijklmo/delete", nil)
	ldt.engine.ServeHTTP(r, req)

	ldt.Equal(http.StatusNotFound, r.Code)
}

func TestLoginDeviceController(t *testing.T) {
	suite.Run(t, new(LoginDeviceControllerTestSuite))
}
