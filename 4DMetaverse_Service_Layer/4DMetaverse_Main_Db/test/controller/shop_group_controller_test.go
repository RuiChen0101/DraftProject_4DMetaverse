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

type ShopGroupControllerTestSuite struct {
	suite.Suite
	engine           *gin.Engine
	shopGroupService *mocks.MockShopGroupService
}

func (sct *ShopGroupControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sct.T())
	defer ctrl.Finish()

	sct.shopGroupService = mocks.NewMockShopGroupService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"shop_group": sct.shopGroupService,
	})
	sct.engine = gin.Default()

	controller.RegisterShopGroupApi(sct.engine, sm)
}

func (sct *ShopGroupControllerTestSuite) TestCreate() {
	sct.shopGroupService.EXPECT().CreateEntity(service.ShopGroupCreateDTO{
		Title: "ShopGroupTitle",
	}).Return(&entity.ShopGroup{Id: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), Title: "ShopGroupTitle"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shopGroup/create", bytes.NewBufferString("{\"title\":\"ShopGroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"id\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\",\"title\":\"ShopGroupTitle\",\"tags\":null,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (sct *ShopGroupControllerTestSuite) TestCreateFail() {
	sct.shopGroupService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fails"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/shopGroup/create", bytes.NewBufferString("{\"title\":\"ShopGroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusBadRequest, r.Code)
}

func (sct *ShopGroupControllerTestSuite) TestUpdate() {
	sct.shopGroupService.EXPECT().UpdateEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), service.ShopGroupUpdateDTO{
		Title: "ShopGroupTitle",
	}).Return(&entity.ShopGroup{Id: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), Title: "ShopGroupTitle"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shopGroup/9551bce5-a397-4c4a-bfa4-ae816bba5e3c/update", bytes.NewBufferString("{\"title\":\"ShopGroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusOK, r.Code)
	sct.Equal("{\"id\":\"9551bce5-a397-4c4a-bfa4-ae816bba5e3c\",\"title\":\"ShopGroupTitle\",\"tags\":null,\"status\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (sct *ShopGroupControllerTestSuite) TestUpdateFail() {
	sct.shopGroupService.EXPECT().UpdateEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/shopGroup/9551bce5-a397-4c4a-bfa4-ae816bba5e3c/update", bytes.NewBufferString("{\"title\":\"ShopGroupTitle\"}"))
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNotFound, r.Code)
}

func (sct *ShopGroupControllerTestSuite) TestDelete() {
	sct.shopGroupService.EXPECT().DeleteEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c")).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shopGroup/9551bce5-a397-4c4a-bfa4-ae816bba5e3c/delete", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNoContent, r.Code)
}

func (sct *ShopGroupControllerTestSuite) TestDeleteFail() {
	sct.shopGroupService.EXPECT().DeleteEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c")).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/shopGroup/9551bce5-a397-4c4a-bfa4-ae816bba5e3c/delete", nil)
	sct.engine.ServeHTTP(r, req)

	sct.Equal(http.StatusNotFound, r.Code)
}

func TestShopGroupController(t *testing.T) {
	suite.Run(t, new(ShopGroupControllerTestSuite))
}
