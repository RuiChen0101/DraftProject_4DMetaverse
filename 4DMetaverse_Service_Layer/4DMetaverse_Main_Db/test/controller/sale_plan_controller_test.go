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

type SalePlanControllerTestSuite struct {
	suite.Suite
	engine          *gin.Engine
	salePlanService *mocks.MockSalePlanService
}

func (spt *SalePlanControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(spt.T())
	defer ctrl.Finish()

	spt.salePlanService = mocks.NewMockSalePlanService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"sale_plan": spt.salePlanService,
	})
	spt.engine = gin.Default()

	controller.RegisterSalePlanApi(spt.engine, sm)
}

func (spt *SalePlanControllerTestSuite) TestCreate() {
	spt.salePlanService.EXPECT().CreateEntity(service.SalePlanCreateDTO{
		Name: "SalePlanName",
	}).Return(&entity.SalePlan{Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), Name: "SalePlanName"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/salePlan/create", bytes.NewBufferString("{\"name\":\"SalePlanName\"}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusOK, r.Code)
	spt.Equal("{\"previewCollection\":null,\"id\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\",\"shopId\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"SalePlanName\",\"price\":0,\"status\":0,\"isDefault\":false,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (spt *SalePlanControllerTestSuite) TestCreateFail() {
	spt.salePlanService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/salePlan/create", bytes.NewBufferString("{\"name\":\"SalePlanName\"}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusBadRequest, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestUpdate() {
	spt.salePlanService.EXPECT().UpdateEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanUpdateDTO{
		Name: "SalePlanName",
	}).Return(&entity.SalePlan{Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), Name: "SalePlanName"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/update", bytes.NewBufferString("{\"name\":\"SalePlanName\"}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusOK, r.Code)
	spt.Equal("{\"previewCollection\":null,\"id\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\",\"shopId\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"SalePlanName\",\"price\":0,\"status\":0,\"isDefault\":false,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (spt *SalePlanControllerTestSuite) TestUpdateFail() {
	spt.salePlanService.EXPECT().UpdateEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/update", bytes.NewBufferString("{\"name\":\"SalePlanName\"}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNotFound, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestSetCollection() {
	spt.salePlanService.EXPECT().SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanSetCollectionsDTO{
		CollectionIds: []uuid.UUID{uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")},
	}).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/setCollections", bytes.NewBufferString("{\"collectionIds\":[\"00a95659-4b52-490a-ab27-d1d08d16832a\"]}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNoContent, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestSetCollectionFail() {
	spt.salePlanService.EXPECT().SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanSetCollectionsDTO{
		CollectionIds: []uuid.UUID{uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")},
	}).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/setCollections", bytes.NewBufferString("{\"collectionIds\":[\"00a95659-4b52-490a-ab27-d1d08d16832a\"]}"))
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNotFound, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestSwitchDefault() {
	spt.salePlanService.EXPECT().SwitchDefault(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/switchDefault", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNoContent, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestSwitchDefaultFail() {
	spt.salePlanService.EXPECT().SwitchDefault(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/switchDefault", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNotFound, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestDelete() {
	spt.salePlanService.EXPECT().DeleteEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/delete", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNoContent, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestDeleteFail() {
	spt.salePlanService.EXPECT().DeleteEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/delete", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNotFound, r.Code)
}

func (spt *SalePlanControllerTestSuite) TestGet() {
	spt.salePlanService.EXPECT().GetEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(&entity.SalePlan{
		Id:   uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		Name: "SalePlanName",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/get", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusOK, r.Code)
	spt.Equal("{\"previewCollection\":null,\"id\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\",\"shopId\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"SalePlanName\",\"price\":0,\"status\":0,\"isDefault\":false,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (spt *SalePlanControllerTestSuite) TestGetFail() {
	spt.salePlanService.EXPECT().GetEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/salePlan/49d254d0-1a10-4333-a4a6-3e29a842f6eb/get", nil)
	spt.engine.ServeHTTP(r, req)

	spt.Equal(http.StatusNotFound, r.Code)
}

func TestSalePlanController(t *testing.T) {
	suite.Run(t, new(SalePlanControllerTestSuite))
}
