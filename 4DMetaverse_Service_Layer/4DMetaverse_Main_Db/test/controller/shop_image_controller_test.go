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

type ShopImageControllerTestSuite struct {
	suite.Suite
	engine           *gin.Engine
	shopImageService *mocks.MockShopImageService
}

func (sit *ShopImageControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sit.T())
	defer ctrl.Finish()

	sit.shopImageService = mocks.NewMockShopImageService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"shop_image": sit.shopImageService,
	})
	sit.engine = gin.Default()

	controller.RegisterShopImageApi(sit.engine, sm)
}

func (sit *ShopImageControllerTestSuite) TestCreate() {
	sit.shopImageService.EXPECT().CreateEntity(service.ShopImageCreateDTO{
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
	}).Return(&entity.ShopImage{
		Id:       1,
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shopImage/create", bytes.NewBufferString("{\"shopId\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"imageUrl\":\"http://image.jpg\"}"))
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusOK, r.Code)
	sit.Equal("{\"id\":1,\"shopId\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"imageUrl\":\"http://image.jpg\",\"isCover\":false,\"createAt\":null}", r.Body.String())
}

func (sit *ShopImageControllerTestSuite) TestCreateFail() {
	sit.shopImageService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shopImage/create", bytes.NewBufferString("{\"shopId\":\"31e3aae3-b9e1-4bc5-a8cb-595210859e81\",\"imageUrl\":\"http://image.jpg\"}"))
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusBadRequest, r.Code)
}

func (sit *ShopImageControllerTestSuite) TestSwitchCover() {
	sit.shopImageService.EXPECT().SwitchCover(uint64(1)).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shopImage/1/switchCover", nil)
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusNoContent, r.Code)
}

func (sit *ShopImageControllerTestSuite) TestSwitchCoverFail() {
	sit.shopImageService.EXPECT().SwitchCover(uint64(1)).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shopImage/1/switchCover", nil)
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusNotFound, r.Code)
}

func (sit *ShopImageControllerTestSuite) TestDelete() {
	sit.shopImageService.EXPECT().DeleteEntity(uint64(1)).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shopImage/1/delete", nil)
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusNoContent, r.Code)
}

func (sit *ShopImageControllerTestSuite) TestDeleteFail() {
	sit.shopImageService.EXPECT().DeleteEntity(uint64(1)).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shopImage/1/delete", nil)
	sit.engine.ServeHTTP(r, req)

	sit.Equal(http.StatusNotFound, r.Code)
}

func TestShopImageController(t *testing.T) {
	suite.Run(t, new(ShopImageControllerTestSuite))
}
