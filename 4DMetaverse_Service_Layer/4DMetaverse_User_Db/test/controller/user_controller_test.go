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

type UserControllerTestSuite struct {
	suite.Suite
	userService *mocks.MockUserService
	engine      *gin.Engine
}

func (uct *UserControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(uct.T())
	defer ctrl.Finish()
	uct.userService = mocks.NewMockUserService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"user": uct.userService,
	})

	engine := gin.Default()
	uct.engine = engine
	controller.RegisterUserApi(engine, sm)
}

func (uct *UserControllerTestSuite) TestCreate() {
	uct.userService.EXPECT().CreateEntity(service.UserCreateDTO{
		Id: "1234-5678-90ab-cdef",
	}).Return(&entity.User{Id: "1234-5678-90ab-cdef"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/user/create", bytes.NewBufferString("{\"id\":\"1234-5678-90ab-cdef\"}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusOK, r.Code)
	uct.Equal("{\"wallets\":null,\"id\":\"1234-5678-90ab-cdef\",\"name\":\"\",\"email\":\"\",\"loginMethods\":0,\"phone\":\"\",\"role\":0,\"flag\":0,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (uct *UserControllerTestSuite) TestCreateFail() {
	uct.userService.EXPECT().CreateEntity(gomock.Any()).Return(nil, &mysql.MySQLError{Number: 1062})

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/user/create", bytes.NewBufferString("{}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusConflict, r.Code)
}

func (uct *UserControllerTestSuite) TestUpdate() {
	uct.userService.EXPECT().UpdateEntity("1234-5678-90ab-cdef", service.UserUpdateDTO{
		Name: "name",
	}).Return(&entity.User{Id: "1234-5678-90ab-cdef"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/user/1234-5678-90ab-cdef/update", bytes.NewBufferString("{\"name\":\"name\"}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusOK, r.Code)
	uct.Equal("{\"wallets\":null,\"id\":\"1234-5678-90ab-cdef\",\"name\":\"\",\"email\":\"\",\"loginMethods\":0,\"phone\":\"\",\"role\":0,\"flag\":0,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (uct *UserControllerTestSuite) TestUpdateFail() {
	uct.userService.EXPECT().UpdateEntity("1234-5678-90ab-cdef", gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/user/1234-5678-90ab-cdef/update", bytes.NewBufferString("{\"name\":\"name\"}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusNotFound, r.Code)
}

func (uct *UserControllerTestSuite) TestGetById() {
	uct.userService.EXPECT().GetEntity("1234-5678-90ab-cdef").Return(&entity.User{
		Id:   "1234-5678-90ab-cdef",
		Name: "name",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/1234-5678-90ab-cdef/get", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusOK, r.Code)
	uct.Equal("{\"wallets\":null,\"id\":\"1234-5678-90ab-cdef\",\"name\":\"name\",\"email\":\"\",\"loginMethods\":0,\"phone\":\"\",\"role\":0,\"flag\":0,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (uct *UserControllerTestSuite) TestGetByIdFail() {
	uct.userService.EXPECT().GetEntity("1234-5678-90ab-cdef").Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/1234-5678-90ab-cdef/get", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusNotFound, r.Code)
	uct.Equal("record not found", r.Body.String())
}

func (uct *UserControllerTestSuite) TestGetByEmail() {
	uct.userService.EXPECT().GetEntityByEmail("test@email.com").Return(&entity.User{
		Id:   "1234-5678-90ab-cdef",
		Name: "name",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/get/email/test@email.com", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusOK, r.Code)
	uct.Equal("{\"wallets\":null,\"id\":\"1234-5678-90ab-cdef\",\"name\":\"name\",\"email\":\"\",\"loginMethods\":0,\"phone\":\"\",\"role\":0,\"flag\":0,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (uct *UserControllerTestSuite) TestGetByEmailFail() {
	uct.userService.EXPECT().GetEntityByEmail("test@email.com").Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/user/get/email/test@email.com", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusNotFound, r.Code)
	uct.Equal("record not found", r.Body.String())
}

func TestUserController(t *testing.T) {
	suite.Run(t, new(UserControllerTestSuite))
}
