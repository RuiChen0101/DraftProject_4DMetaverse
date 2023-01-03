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

type ShopServiceTestSuite struct {
	suite.Suite
	shopService      service.ShopService
	shopRepo         *mocks.MockShopRepo
	shopImageService *mocks.MockShopImageService
	salePlanService  *mocks.MockSalePlanService
}

func (sst *ShopServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sst.T())
	defer ctrl.Finish()

	sst.shopRepo = mocks.NewMockShopRepo(ctrl)
	sst.shopImageService = mocks.NewMockShopImageService(ctrl)
	sst.salePlanService = mocks.NewMockSalePlanService(ctrl)

	sst.shopService = service.NewShopService(sst.shopRepo, sst.shopImageService, sst.salePlanService)
}

func (sst *ShopServiceTestSuite) TestGetEntitiesBySQL() {
	sst.shopRepo.EXPECT().FindByNativeSQL("SELECT * FROM shop").Return([]entity.Shop{{
		Id: uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
	}})
	sst.shopImageService.EXPECT().GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.ShopImage{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}, nil)
	sst.salePlanService.EXPECT().GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.SalePlan{
		Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
		Name: "DefaultSalePlan",
	}, nil)

	result := sst.shopService.GetEntitiesBySQL("SELECT * FROM shop")

	sst.EqualValues([]entity.Shop{{
		DefaultSalePlan: &entity.SalePlan{
			Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
			Name: "DefaultSalePlan",
		},
		Id:            uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		CoverImageUrl: "http://image.jpg",
	}}, result)
}

func (sst *ShopServiceTestSuite) TestGetEntity() {
	sst.shopRepo.EXPECT().FindById(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.Shop{
		Id: uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
	}, nil)
	sst.shopImageService.EXPECT().GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.ShopImage{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}, nil)
	sst.salePlanService.EXPECT().GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.SalePlan{
		Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
		Name: "DefaultSalePlan",
	}, nil)

	shop, err := sst.shopService.GetEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sst.Nil(err)
	sst.EqualValues(&entity.Shop{
		DefaultSalePlan: &entity.SalePlan{
			Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
			Name: "DefaultSalePlan",
		},
		Id:            uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		CoverImageUrl: "http://image.jpg",
	}, shop)
}

func (sst *ShopServiceTestSuite) TestGetEntityError() {
	sst.shopRepo.EXPECT().FindById(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, errors.New("fail"))

	shop, err := sst.shopService.GetEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sst.Nil(shop)
	sst.NotNil(err)
}

func (sst *ShopServiceTestSuite) TestCreateEntity() {
	sst.shopRepo.EXPECT().Create(&entity.Shop{
		Id:       uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId:  uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		Title:    "TestShop",
		CreateBy: "createBy",
	}).Return(nil)
	sst.shopImageService.EXPECT().GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, errors.New("fail"))
	sst.salePlanService.EXPECT().GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, errors.New("fail"))

	shop, err := sst.shopService.CreateEntity(service.ShopCreateDTO{
		Id:       uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId:  uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		Title:    "TestShop",
		CreateBy: "createBy",
	})

	sst.Nil(err)
	sst.EqualValues(&entity.Shop{
		DefaultSalePlan: nil,
		Id:              uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId:         uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		CoverImageUrl:   "",
		Title:           "TestShop",
		CreateBy:        "createBy",
	}, shop)
}

func (sst *ShopServiceTestSuite) TestCreateEntityError() {
	sst.shopRepo.EXPECT().Create(gomock.Any()).Return(errors.New("file"))

	shop, err := sst.shopService.CreateEntity(service.ShopCreateDTO{
		Id:       uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		GroupId:  uuid.MustParse("9551bce5-a397-4c4a-bfa4-ae816bba5e3c"),
		Title:    "TestShop",
		CreateBy: "createBy",
	})

	sst.Nil(shop)
	sst.NotNil(err)
}

func (sst *ShopServiceTestSuite) TestUpdateEntity() {
	sst.shopRepo.EXPECT().Update(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), &entity.Shop{
		Title:    "TestShop",
		Status:   1,
		UpdateBy: "updateBy",
	}).Return(nil)
	sst.shopRepo.EXPECT().FindById(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.Shop{
		Id: uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
	}, nil)
	sst.shopImageService.EXPECT().GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.ShopImage{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}, nil)
	sst.salePlanService.EXPECT().GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.SalePlan{
		Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
		Name: "DefaultSalePlan",
	}, nil)

	shop, err := sst.shopService.UpdateEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), service.ShopUpdateDTO{
		Title:    "TestShop",
		Status:   1,
		UpdateBy: "updateBy",
	})

	sst.Nil(err)
	sst.EqualValues(&entity.Shop{
		DefaultSalePlan: &entity.SalePlan{
			Id:   uuid.MustParse("cf6b53b1-eb79-4942-857f-b0624013b859"),
			Name: "DefaultSalePlan",
		},
		Id:            uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		CoverImageUrl: "http://image.jpg",
	}, shop)
}

func (sst *ShopServiceTestSuite) TestUpdateEntityError() {
	sst.shopRepo.EXPECT().Update(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), gomock.Any()).Return(errors.New("fail"))

	shop, err := sst.shopService.UpdateEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"), service.ShopUpdateDTO{
		Title:    "TestShop",
		Status:   1,
		UpdateBy: "updateBy",
	})

	sst.Nil(shop)
	sst.NotNil(err)
}

func (sst *ShopServiceTestSuite) TestDeleteEntity() {
	sst.shopRepo.EXPECT().Delete(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil)

	err := sst.shopService.DeleteEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sst.Nil(err)
}

func (sst *ShopServiceTestSuite) TestDeleteEntityError() {
	sst.shopRepo.EXPECT().Delete(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(errors.New("fails"))

	err := sst.shopService.DeleteEntity(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sst.NotNil(err)
}

func TestShopService(t *testing.T) {
	suite.Run(t, new(ShopServiceTestSuite))
}
