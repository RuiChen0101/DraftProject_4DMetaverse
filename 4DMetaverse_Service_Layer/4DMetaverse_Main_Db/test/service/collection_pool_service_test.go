package service_test

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/service"
	"4dmetaverse/main_db/test/mocks"
	"errors"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type CollectionPoolServiceTestSuite struct {
	suite.Suite
	collectionPoolService service.CollectionPoolService
	collectionPoolRepo    *mocks.MockCollectionPoolRepo
}

func (cpt *CollectionPoolServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(cpt.T())
	defer ctrl.Finish()

	cpt.collectionPoolRepo = mocks.NewMockCollectionPoolRepo(ctrl)
	cpt.collectionPoolService = service.NewCollectionPoolService(cpt.collectionPoolRepo)
}

func (cpt *CollectionPoolServiceTestSuite) TestGetEntitiesBySQL() {
	cpt.collectionPoolRepo.EXPECT().FindByNativeSQL("SELECT * FROM collection_pool").Return([]entity.CollectionPool{{
		Id: 1,
	}})

	result := cpt.collectionPoolService.GetEntitiesBySQL("SELECT * FROM collection_pool")

	cpt.EqualValues([]entity.CollectionPool{{
		Id: 1,
	}}, result)
}

func (cpt *CollectionPoolServiceTestSuite) TestCreteEntity() {
	cpt.collectionPoolRepo.EXPECT().Create(&entity.CollectionPool{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	}).Return(nil)

	pool, err := cpt.collectionPoolService.CreateEntity(service.CollectionPoolCreateDTO{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	})

	cpt.Nil(err)
	cpt.EqualValues(&entity.CollectionPool{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	}, pool)
}

func (cpt *CollectionPoolServiceTestSuite) TestCreteEntityError() {
	cpt.collectionPoolRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	pool, err := cpt.collectionPoolService.CreateEntity(service.CollectionPoolCreateDTO{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	})

	cpt.Nil(pool)
	cpt.NotNil(err)
}

func (cpt *CollectionPoolServiceTestSuite) TestUpdateEntity() {
	cpt.collectionPoolRepo.EXPECT().Update(uint64(1), &entity.CollectionPool{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		UpdateBy:      "updateBy",
	}).Return(nil)
	cpt.collectionPoolRepo.EXPECT().FindById(uint64(1)).Return(&entity.CollectionPool{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		UpdateBy:      "updateBy",
	}, nil)

	pool, err := cpt.collectionPoolService.UpdateEntity(1, service.CollectionPoolUpdateDTO{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		UpdateBy:      "updateBy",
	})

	cpt.Nil(err)
	cpt.EqualValues(&entity.CollectionPool{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		UpdateBy:      "updateBy",
	}, pool)
}

func (cpt *CollectionPoolServiceTestSuite) TestUpdateEntityError() {
	cpt.collectionPoolRepo.EXPECT().Update(uint64(1), gomock.Any()).Return(errors.New("fail"))

	pool, err := cpt.collectionPoolService.UpdateEntity(1, service.CollectionPoolUpdateDTO{
		Name:          "PoolName",
		CoverImageUrl: "http://image.jpg",
		UpdateBy:      "updateBy",
	})

	cpt.Nil(pool)
	cpt.NotNil(err)
}

func (cpt *CollectionPoolServiceTestSuite) TestDeleteEntity() {
	cpt.collectionPoolRepo.EXPECT().CountCollection(uint64(1)).Return(int64(0))
	cpt.collectionPoolRepo.EXPECT().Delete(uint64(1)).Return(nil)

	err := cpt.collectionPoolService.DeleteEntity(1)

	cpt.Nil(err)
}

func (cpt *CollectionPoolServiceTestSuite) TestDeleteEntityNonEmptyError() {
	cpt.collectionPoolRepo.EXPECT().CountCollection(uint64(1)).Return(int64(1))
	cpt.collectionPoolRepo.EXPECT().Delete(uint64(1)).Return(nil)

	err := cpt.collectionPoolService.DeleteEntity(1)

	cpt.Equal("CollectionPoolService: cannot delete non-empty pool", err.Error())
}

func (cpt *CollectionPoolServiceTestSuite) TestDeleteEntityError() {
	cpt.collectionPoolRepo.EXPECT().CountCollection(uint64(1)).Return(int64(0))
	cpt.collectionPoolRepo.EXPECT().Delete(uint64(1)).Return(errors.New("fail"))

	err := cpt.collectionPoolService.DeleteEntity(1)

	cpt.NotNil(err)
}

func TestCollectionPoolService(t *testing.T) {
	suite.Run(t, new(CollectionPoolServiceTestSuite))
}
