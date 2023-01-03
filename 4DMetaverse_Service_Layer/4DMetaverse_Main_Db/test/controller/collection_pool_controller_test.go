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
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type CollectionPoolControllerTestSuite struct {
	suite.Suite
	engine                *gin.Engine
	collectionPoolService *mocks.MockCollectionPoolService
}

func (cpt *CollectionPoolControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(cpt.T())
	defer ctrl.Finish()

	cpt.collectionPoolService = mocks.NewMockCollectionPoolService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"collection_pool": cpt.collectionPoolService,
	})
	cpt.engine = gin.Default()

	controller.RegisterCollectionPoolApi(cpt.engine, sm)
}

func (cpt *CollectionPoolControllerTestSuite) TestCreate() {
	cpt.collectionPoolService.EXPECT().CreateEntity(service.CollectionPoolCreateDTO{
		Name: "CollectionPoolName",
	}).Return(&entity.CollectionPool{Id: 1, Name: "CollectionPoolName"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/collectionPool/create", bytes.NewBufferString("{\"name\":\"CollectionPoolName\"}"))
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusOK, r.Code)
	cpt.Equal("{\"id\":1,\"name\":\"CollectionPoolName\",\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (cpt *CollectionPoolControllerTestSuite) TestCreateFail() {
	cpt.collectionPoolService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/collectionPool/create", bytes.NewBufferString("{\"name\":\"CollectionPoolName\"}"))
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusBadRequest, r.Code)
}

func (cpt *CollectionPoolControllerTestSuite) TestUpdate() {
	cpt.collectionPoolService.EXPECT().UpdateEntity(uint64(1), service.CollectionPoolUpdateDTO{
		Name: "CollectionPoolName",
	}).Return(&entity.CollectionPool{Id: 1, Name: "CollectionPoolName"}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/collectionPool/1/update", bytes.NewBufferString("{\"name\":\"CollectionPoolName\"}"))
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusOK, r.Code)
	cpt.Equal("{\"id\":1,\"name\":\"CollectionPoolName\",\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (cpt *CollectionPoolControllerTestSuite) TestUpdateFail() {
	cpt.collectionPoolService.EXPECT().UpdateEntity(uint64(1), gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/collectionPool/1/update", bytes.NewBufferString("{\"name\":\"CollectionPoolName\"}"))
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusNotFound, r.Code)
}

func (cpt *CollectionPoolControllerTestSuite) TestDelete() {
	cpt.collectionPoolService.EXPECT().DeleteEntity(uint64(1)).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/collectionPool/1/delete", nil)
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusNoContent, r.Code)
}

func (cpt *CollectionPoolControllerTestSuite) TestDeleteFail() {
	cpt.collectionPoolService.EXPECT().DeleteEntity(uint64(1)).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/collectionPool/1/delete", nil)
	cpt.engine.ServeHTTP(r, req)

	cpt.Equal(http.StatusNotFound, r.Code)
}

func TestCollectionPoolController(t *testing.T) {
	suite.Run(t, new(CollectionPoolControllerTestSuite))
}
