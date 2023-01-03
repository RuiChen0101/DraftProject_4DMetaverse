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

type UnlockedCollectionControllerTestSuite struct {
	suite.Suite
	engine                    *gin.Engine
	unlockedCollectionService *mocks.MockUnlockedCollectionService
}

func (uct *UnlockedCollectionControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(uct.T())
	defer ctrl.Finish()

	uct.unlockedCollectionService = mocks.NewMockUnlockedCollectionService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"unlocked_collection": uct.unlockedCollectionService,
	})
	uct.engine = gin.Default()

	controller.RegisterUnlockedCollectionApi(uct.engine, sm)
}

func (uct *UnlockedCollectionControllerTestSuite) TestCreate() {
	uct.unlockedCollectionService.EXPECT().CreateEntity(service.UnlockedCollectionCreateDTO{
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	}).Return(&entity.UnlockedCollection{
		Id:           1,
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/unlockedCollection/create", bytes.NewBufferString("{\"collectionId\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"createBy\":\"5xvx-fgh9-ihjo-5g4c\"}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusOK, r.Code)
	uct.Equal("{\"id\":1,\"collectionId\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"createAt\":null,\"createBy\":\"5xvx-fgh9-ihjo-5g4c\"}", r.Body.String())
}

func (uct *UnlockedCollectionControllerTestSuite) TestCreateFail() {
	uct.unlockedCollectionService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/unlockedCollection/create", bytes.NewBufferString("{\"collectionId\":\"00a95659-4b52-490a-ab27-d1d08d16832a\",\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"createBy\":\"5xvx-fgh9-ihjo-5g4c\"}"))
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusBadRequest, r.Code)
}

func (uct *UnlockedCollectionControllerTestSuite) TestDelete() {
	uct.unlockedCollectionService.EXPECT().DeleteEntity(uint64(1)).Return(nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/unlockedCollection/1/delete", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusNoContent, r.Code)
}

func (uct *UnlockedCollectionControllerTestSuite) TestDeleteFail() {
	uct.unlockedCollectionService.EXPECT().DeleteEntity(uint64(1)).Return(gorm.ErrRecordNotFound)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/unlockedCollection/1/delete", nil)
	uct.engine.ServeHTTP(r, req)

	uct.Equal(http.StatusNotFound, r.Code)
}

func TestUnlockedCollectionController(t *testing.T) {
	suite.Run(t, new(UnlockedCollectionControllerTestSuite))
}
