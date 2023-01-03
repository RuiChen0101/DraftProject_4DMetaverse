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

type CollectionServiceTestSuite struct {
	suite.Suite
	collectionService service.CollectionService
	collectionRepo    *mocks.MockCollectionRepo
}

func (cst *CollectionServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(cst.T())
	defer ctrl.Finish()

	cst.collectionRepo = mocks.NewMockCollectionRepo(ctrl)
	cst.collectionService = service.NewCollectionService(cst.collectionRepo)
}

func (cst *CollectionServiceTestSuite) TestGetEntitiesBySQL() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(1))
	cst.collectionRepo.EXPECT().FindByNativeSQL("SELECT * FROM collection").Return([]entity.Collection{{
		Id: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
	}})

	result := cst.collectionService.GetEntitiesBySQL("SELECT * FROM collection")

	cst.EqualValues([]entity.Collection{{
		Id:            uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		TotalUnlocked: 1,
	}}, result)
}

func (cst *CollectionServiceTestSuite) TestGetEntity() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(1))
	cst.collectionRepo.EXPECT().FindById(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(&entity.Collection{
		Id: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
	}, nil)

	collection, err := cst.collectionService.GetEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"))

	cst.Nil(err)
	cst.EqualValues(&entity.Collection{
		Id:            uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		TotalUnlocked: 1,
	}, collection)
}

func (cst *CollectionServiceTestSuite) TestGetEntityError() {
	cst.collectionRepo.EXPECT().FindById(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(nil, errors.New("fail"))

	collection, err := cst.collectionService.GetEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"))

	cst.Nil(collection)
	cst.NotNil(err)
}

func (cst *CollectionServiceTestSuite) TestGetPreviewsBySalePlanId() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(1))
	cst.collectionRepo.EXPECT().ListBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return([]entity.Collection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		Title:           "CollectionTitle",
		Type:            1,
		PreviewImageUrl: "http://image.jpg",
		Available:       -1,
	}}, nil)

	previews, err := cst.collectionService.GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	cst.Nil(err)
	cst.EqualValues([]entity.PreviewCollection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		Title:           "CollectionTitle",
		Type:            1,
		PreviewImageUrl: "http://image.jpg",
		Available:       -1,
		TotalUnlocked:   1,
	}}, previews)
}

func (cst *CollectionServiceTestSuite) TestGetPreviewsBySalePlanIdError() {
	cst.collectionRepo.EXPECT().ListBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil, errors.New("fail"))

	previews, err := cst.collectionService.GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	cst.Nil(previews)
	cst.NotNil(err)
}

func (cst *CollectionServiceTestSuite) TestCreateEntity() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(0))
	cst.collectionRepo.EXPECT().Create(&entity.Collection{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Data:             map[string]interface{}{},
		Available:        -1,
		CreateBy:         "createBy",
	}).Return(nil)

	collection, err := cst.collectionService.CreateEntity(service.CollectionCreateDTO{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Available:        -1,
		CreateBy:         "createBy",
	})

	cst.Nil(err)
	cst.EqualValues(&entity.Collection{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Data:             map[string]interface{}{},
		Available:        -1,
		TotalUnlocked:    0,
		CreateBy:         "createBy",
	}, collection)
}

func (cst *CollectionServiceTestSuite) TestCreateEntityError() {
	cst.collectionRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	collection, err := cst.collectionService.CreateEntity(service.CollectionCreateDTO{
		Id:               uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		CollectionPoolId: 1,
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Available:        -1,
		CreateBy:         "createBy",
	})

	cst.Nil(collection)
	cst.NotNil(err)
}

func (cst *CollectionServiceTestSuite) TestUpdateEntity() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(1))
	cst.collectionRepo.EXPECT().Update(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), &entity.Collection{
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Status:           1,
		Available:        -1,
		UpdateBy:         "updateBy",
	}).Return(nil)
	cst.collectionRepo.EXPECT().FindById(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(&entity.Collection{
		Id: uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
	}, nil)

	collection, err := cst.collectionService.UpdateEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), service.CollectionUpdateDTO{
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Status:           1,
		Available:        -1,
		UpdateBy:         "updateBy",
	})

	cst.Nil(err)
	cst.EqualValues(&entity.Collection{
		Id:            uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		TotalUnlocked: 1,
	}, collection)
}

func (cst *CollectionServiceTestSuite) TestUpdateEntityError() {
	cst.collectionRepo.EXPECT().Update(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), gomock.Any()).Return(errors.New("fail"))

	collection, err := cst.collectionService.UpdateEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"), service.CollectionUpdateDTO{
		Title:            "CollectionTitle",
		Type:             1,
		PreviewImageUrl:  "http://preview.jpg",
		UnlockedImageUrl: "http://unlock.jpg",
		MediaUrl:         "http://media.jpg",
		Status:           1,
		Available:        -1,
		UpdateBy:         "updateBy",
	})

	cst.Nil(collection)
	cst.NotNil(err)
}

func (cst *CollectionServiceTestSuite) TestDeleteEntity() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(0))
	cst.collectionRepo.EXPECT().Delete(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(nil)

	err := cst.collectionService.DeleteEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"))

	cst.Nil(err)
}

func (cst *CollectionServiceTestSuite) TestDeleteEntityNonEmptyError() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(1))
	cst.collectionRepo.EXPECT().Delete(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(nil)

	err := cst.collectionService.DeleteEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"))

	cst.Equal("CollectionService: cannot delete unlocked collection", err.Error())
}

func (cst *CollectionServiceTestSuite) TestDeleteEntityError() {
	cst.collectionRepo.EXPECT().CountUnlocked(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(int64(0))
	cst.collectionRepo.EXPECT().Delete(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a")).Return(errors.New("fail"))

	err := cst.collectionService.DeleteEntity(uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"))

	cst.NotNil(err)
}

func TestCollectionService(t *testing.T) {
	suite.Run(t, new(CollectionServiceTestSuite))
}
