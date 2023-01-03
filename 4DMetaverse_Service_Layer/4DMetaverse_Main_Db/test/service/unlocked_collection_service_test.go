package service_test

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/test/mocks"
	"errors"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/suite"
)

type UnlockedCollectionServiceTestSuite struct {
	suite.Suite
	unlockedCollectionService service.UnlockedCollectionService
	unlockedCollectionRepo    *mocks.MockUnlockedCollectionRepo
}

func (uct *UnlockedCollectionServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(uct.T())
	defer ctrl.Finish()

	uct.unlockedCollectionRepo = mocks.NewMockUnlockedCollectionRepo(ctrl)
	uct.unlockedCollectionService = service.NewUnlockedCollectionService(uct.unlockedCollectionRepo)
}

func (uct *UnlockedCollectionServiceTestSuite) TestGetEntitiesBySQL() {
	uct.unlockedCollectionRepo.EXPECT().FindByNativeSQL("SELECT * FROM unlocked_collection").Return([]entity.UnlockedCollection{{
		Id: 1,
	}})

	result := uct.unlockedCollectionService.GetEntitiesBySQL("SELECT * FROM unlocked_collection")

	uct.EqualValues([]entity.UnlockedCollection{{
		Id: 1,
	}}, result)
}

func (uct *UnlockedCollectionServiceTestSuite) TestCreateEntity() {
	uct.unlockedCollectionRepo.EXPECT().Create(&entity.UnlockedCollection{
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	}).Return(nil)

	unlocked, err := uct.unlockedCollectionService.CreateEntity(service.UnlockedCollectionCreateDTO{
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	})

	uct.Nil(err)
	uct.EqualValues(&entity.UnlockedCollection{
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	}, unlocked)
}

func (uct *UnlockedCollectionServiceTestSuite) TestCreateEntityError() {
	uct.unlockedCollectionRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	unlocked, err := uct.unlockedCollectionService.CreateEntity(service.UnlockedCollectionCreateDTO{
		CollectionId: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		UserId:       "5xvx-fgh9-ihjo-5g4c",
		CreateBy:     "5xvx-fgh9-ihjo-5g4c",
	})

	uct.Nil(unlocked)
	uct.NotNil(err)
}

func (uct *UnlockedCollectionServiceTestSuite) TestDeleteEntity() {
	uct.unlockedCollectionRepo.EXPECT().Delete(uint64(1)).Return(nil)

	err := uct.unlockedCollectionService.DeleteEntity(1)

	uct.Nil(err)
}

func (uct *UnlockedCollectionServiceTestSuite) TestDeleteEntityError() {
	uct.unlockedCollectionRepo.EXPECT().Delete(uint64(1)).Return(errors.New("fail"))

	err := uct.unlockedCollectionService.DeleteEntity(1)

	uct.NotNil(err)
}

func TestUnlockedCollectionService(t *testing.T) {
	suite.Run(t, new(UnlockedCollectionServiceTestSuite))
}
