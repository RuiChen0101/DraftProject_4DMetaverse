package controller_test

import (
	"4dmetaverse/main_db/internal/controller"
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/test/mocks"
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type ShopControllerTestSuite struct {
	suite.Suite
	engine      *gin.Engine
	shopService *mocks.MockShopService
}

func (sct *ShopControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sct.T())
	defer ctrl.Finish()

	sct.shopService = mocks.NewMockShopService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"shop": sct.shopService,
	})
	sct.engine = gin.Default()

	controller.RegisterShopApi(sct.engine, sm)
}

func (sct *ShopControllerTestSuite) TestCreate() {
	sct.shopService.EXPECT().CreateEntity(service.ShopCreateDTO{
		GroupId: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
	}).Return(&entity.Shop{
		Id:      uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shop/create", bytes.NewBufferString("{\"groupId\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"id\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"groupId\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\",\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (sct *ShopControllerTestSuite) TestCreateFail() {
	sct.shopService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shop/create", bytes.NewBufferString("{\"groupId\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusBadRequest, r.Code)
}

func (sct *ShopControllerTestSuite) TestUpdate() {
	sct.shopService.EXPECT().UpdateEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), service.ShopUpdateDTO{
		Title: "GroupTitle",
	}).Return(&entity.Shop{
		Id:      uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		Title:   "GroupTitle",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/update", bytes.NewBufferString("{\"title\":\"GroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"id\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"groupId\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\",\"title\":\"GroupTitle\",\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (sct *ShopControllerTestSuite) TestUpdateFail() {
	sct.shopService.EXPECT().UpdateEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/update", bytes.NewBufferString("{\"title\":\"GroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNotFound, r.Code)
}

func (sct *ShopControllerTestSuite) TestDelete() {
	sct.shopService.EXPECT().DeleteEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/delete", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNoContent, r.Code)
}

func (sct *ShopControllerTestSuite) TestDeleteFail() {
	sct.shopService.EXPECT().DeleteEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/delete", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNotFound, r.Code)
}

func (sct *ShopControllerTestSuite) TestGet() {
	sct.shopService.EXPECT().GetEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.Shop{
		Id:      uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		Title:   "GroupTitle",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/get", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"id\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"groupId\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\",\"title\":\"GroupTitle\",\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (sct *ShopControllerTestSuite) TestGetFail() {
	sct.shopService.EXPECT().GetEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/shop/31e3aae3-b9e1-4bc5-a8cb-595210859e81/get", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNotFound, r.Code)
}

func TestShopController(t *testing.T) {
	suite.Run(t, new(ShopControllerTestSuite))
}
