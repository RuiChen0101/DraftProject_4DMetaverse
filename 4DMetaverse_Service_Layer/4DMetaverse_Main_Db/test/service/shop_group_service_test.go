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

type ShopGroupServiceTestSuite struct {
	suite.Suite
	seriesService service.ShopGroupService
	seriesRepo    *mocks.MockShopGroupRepo
}

func (sst *ShopGroupServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sst.T())
	defer ctrl.Finish()

	sst.seriesRepo = mocks.NewMockShopGroupRepo(ctrl)
	sst.seriesService = service.NewShopGroupService(sst.seriesRepo)
}

func (sst *ShopGroupServiceTestSuite) TestGetEntitiesBySql() {
	sst.seriesRepo.EXPECT().FindByNativeSQL("SELECT * FROM series").Return([]entity.ShopGroup{{
		Id: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
	}})

	result := sst.seriesService.GetEntitiesBySQL("SELECT * FROM series")

	sst.EqualValues([]entity.ShopGroup{{
		Id: uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
	}}, result)
}

func (sst *ShopGroupServiceTestSuite) TestCreateEntity() {
	sst.seriesRepo.EXPECT().Create(&entity.ShopGroup{
		Title:         "title",
		Tags:          []string{},
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	}).Return(nil)

	series, err := sst.seriesService.CreateEntity(service.ShopGroupCreateDTO{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	})

	sst.Nil(err)
	sst.EqualValues(&entity.ShopGroup{
		Title:         "title",
		Tags:          []string{},
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	}, series)
}

func (sst *ShopGroupServiceTestSuite) TestCreateEntityError() {
	sst.seriesRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	series, err := sst.seriesService.CreateEntity(service.ShopGroupCreateDTO{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		CreateBy:      "createBy",
	})

	sst.Nil(series)
	sst.NotNil(err)
}

func (sst *ShopGroupServiceTestSuite) TestUpdateEntity() {
	sst.seriesRepo.EXPECT().Update(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), &entity.ShopGroup{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		Status:        1,
		UpdateBy:      "updateBy",
	}).Return(nil)
	sst.seriesRepo.EXPECT().FindById(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c")).Return(
		&entity.ShopGroup{
			Title:         "title",
			CoverImageUrl: "http://image.jpg",
			Status:        1,
			UpdateBy:      "updateBy",
		},
		nil,
	)

	series, err := sst.seriesService.UpdateEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), service.ShopGroupUpdateDTO{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		Status:        1,
		UpdateBy:      "updateBy",
	})

	sst.Nil(err)
	sst.EqualValues(&entity.ShopGroup{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		Status:        1,
		UpdateBy:      "updateBy",
	}, series)
}

func (sst *ShopGroupServiceTestSuite) TestUpdateEntityError() {
	sst.seriesRepo.EXPECT().Update(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), gomock.Any()).Return(errors.New("fail"))

	series, err := sst.seriesService.UpdateEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"), service.ShopGroupUpdateDTO{
		Title:         "title",
		CoverImageUrl: "http://image.jpg",
		Status:        1,
		UpdateBy:      "updateBy",
	})

	sst.Nil(series)
	sst.NotNil(err)
}

func (sst *ShopGroupServiceTestSuite) TestDeleteEntity() {
	sst.seriesRepo.EXPECT().Delete(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c")).Return(nil)

	err := sst.seriesService.DeleteEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"))
	sst.Nil(err)
}

func (sst *ShopGroupServiceTestSuite) TestDeleteEntityError() {
	sst.seriesRepo.EXPECT().Delete(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c")).Return(errors.New("fail"))

	err := sst.seriesService.DeleteEntity(uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"))
	sst.NotNil(err)
}

func TestShopGroupService(t *testing.T) {
	suite.Run(t, new(ShopGroupServiceTestSuite))
}
