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

type CollectionControllerTestSuite struct {
	suite.Suite
	engine            *gin.Engine
	collectionService *mocks.MockCollectionService
}

func (cct *CollectionControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(cct.T())
	defer ctrl.Finish()

	cct.collectionService = mocks.NewMockCollectionService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"collection": cct.collectionService,
	})
	cct.engine = gin.Default()

	controller.RegisterCollectionApi(cct.engine, sm)
}

func (cct *CollectionControllerTestSuite) TestCreate() {
	cct.collectionService.EXPECT().CreateEntity(service.CollectionCreateDTO{
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
	}).Return(&entity.Collection{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/collection/create", bytes.NewBufferString("{\"collectionPoolId\":1,\"title\":\"CollectionTitle\"}"))
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusOK, r.Code)
	cct.Equal("{\"id\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"collectionPoolId\":1,\"title\":\"CollectionTitle\",\"type\":0,\"status\":0,\"available\":0,\"totalUnlocked\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (cct *CollectionControllerTestSuite) TestCreateFail() {
	cct.collectionService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/collection/create", bytes.NewBufferString("{\"collectionPoolId\":1,\"title\":\"CollectionTitle\"}"))
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusBadRequest, r.Code)
}

func (cct *CollectionControllerTestSuite) TestUpdate() {
	cct.collectionService.EXPECT().UpdateEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), service.CollectionUpdateDTO{
		Title: "CollectionTitle",
	}).Return(&entity.Collection{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/update", bytes.NewBufferString("{\"title\":\"CollectionTitle\"}"))
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusOK, r.Code)
	cct.Equal("{\"id\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"collectionPoolId\":1,\"title\":\"CollectionTitle\",\"type\":0,\"status\":0,\"available\":0,\"totalUnlocked\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (cct *CollectionControllerTestSuite) TestUpdateFail() {
	cct.collectionService.EXPECT().UpdateEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), gomock.Any()).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/update", bytes.NewBufferString("{\"title\":\"CollectionTitle\"}"))
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusNotFound, r.Code)
}

func (cct *CollectionControllerTestSuite) TestDelete() {
	cct.collectionService.EXPECT().DeleteEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/delete", nil)
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusNoContent, r.Code)
}

func (cct *CollectionControllerTestSuite) TestDeleteFail() {
	cct.collectionService.EXPECT().DeleteEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/delete", nil)
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusNotFound, r.Code)
}

func (cct *CollectionControllerTestSuite) TestGet() {
	cct.collectionService.EXPECT().GetEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(&entity.Collection{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/get", nil)
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusOK, r.Code)
	cct.Equal("{\"id\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"collectionPoolId\":1,\"title\":\"CollectionTitle\",\"type\":0,\"status\":0,\"available\":0,\"totalUnlocked\":0,\"createAt\":null,\"updateAt\":null}", r.Body.String())
}

func (cct *CollectionControllerTestSuite) TestGetFail() {
	cct.collectionService.EXPECT().GetEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(nil, gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/collection/00a95659-4b52-490a-ab27-d1d08d16832a/get", nil)
	cct.engine.ServeHTTP(r, req)

	cct.Equal(http.StatusNotFound, r.Code)
}

func TestCollectionController(t *testing.T) {
	suite.Run(t, new(CollectionControllerTestSuite))
}
