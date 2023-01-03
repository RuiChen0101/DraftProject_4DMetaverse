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
	"gorm.io/gorm"
)

type ShopImageServiceTestSuite struct {
	suite.Suite
	shopImageService service.ShopImageService
	shopImageRepo    *mocks.MockShopImageRepo
}

func (sit *ShopImageServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(sit.T())
	defer ctrl.Finish()

	sit.shopImageRepo = mocks.NewMockShopImageRepo(ctrl)
	sit.shopImageService = service.NewShopImageService(sit.shopImageRepo)
}

func (sit *ShopImageServiceTestSuite) TestGetEntitiesBySQL() {
	sit.shopImageRepo.EXPECT().FindByNativeSQL("SELECT * FROM shop_image").Return([]entity.ShopImage{{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}})

	result := sit.shopImageService.GetEntitiesBySQL("SELECT * FROM shop_image")

	sit.EqualValues([]entity.ShopImage{{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}}, result)
}

func (sit *ShopImageServiceTestSuite) TestGetCoverImage() {
	sit.shopImageRepo.EXPECT().FindCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.ShopImage{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}, nil)

	image, err := sit.shopImageService.GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sit.Nil(err)
	sit.EqualValues(&entity.ShopImage{
		Id:       1,
		ImageUrl: "http://image.jpg",
	}, image)
}

func (sit *ShopImageServiceTestSuite) TestGetCoverImageError() {
	sit.shopImageRepo.EXPECT().FindCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, errors.New("fail"))

	image, err := sit.shopImageService.GetCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	sit.Nil(image)
	sit.NotNil(err)
}

func (sit *ShopImageServiceTestSuite) TestCreateEntity() {
	sit.shopImageRepo.EXPECT().Create(&entity.ShopImage{
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		IsCover:  true,
		CreateBy: "createBy",
	}).Return(nil)

	image, err := sit.shopImageService.CreateEntity(service.ShopImageCreateDTO{
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		IsCover:  true,
		CreateBy: "createBy",
	})

	sit.Nil(err)
	sit.EqualValues(&entity.ShopImage{
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		IsCover:  true,
		CreateBy: "createBy",
	}, image)
}

func (sit *ShopImageServiceTestSuite) TestCreateEntityError() {
	sit.shopImageRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	image, err := sit.shopImageService.CreateEntity(service.ShopImageCreateDTO{
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		CreateBy: "createBy",
	})

	sit.Nil(image)
	sit.NotNil(err)
}

func (sit *ShopImageServiceTestSuite) TestSwitchCoverWithOld() {
	sit.shopImageRepo.EXPECT().FindById(uint64(1)).Return(&entity.ShopImage{
		Id:       1,
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		IsCover:  false,
		CreateBy: "createBy",
	}, nil)
	sit.shopImageRepo.EXPECT().FindCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.ShopImage{
		Id:      2,
		IsCover: true,
	}, nil)
	sit.shopImageRepo.EXPECT().Update(uint64(2), &entity.ShopImage{IsCover: false}).Return(nil)
	sit.shopImageRepo.EXPECT().Update(uint64(1), &entity.ShopImage{IsCover: true}).Return(nil)

	err := sit.shopImageService.SwitchCover(1)

	sit.Nil(err)
}

func (sit *ShopImageServiceTestSuite) TestSwitchCoverWithoutOld() {
	sit.shopImageRepo.EXPECT().FindById(uint64(1)).Return(&entity.ShopImage{
		Id:       1,
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		ImageUrl: "http://image.jpg",
		IsCover:  false,
		CreateBy: "createBy",
	}, nil)
	sit.shopImageRepo.EXPECT().FindCoverImage(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, gorm.ErrRecordNotFound)
	sit.shopImageRepo.EXPECT().Update(uint64(1), &entity.ShopImage{IsCover: true}).Return(nil)

	err := sit.shopImageService.SwitchCover(1)

	sit.Nil(err)
}

func (sit *ShopImageServiceTestSuite) TestSwitchCoverGetError() {
	sit.shopImageRepo.EXPECT().FindById(uint64(1)).Return(nil, gorm.ErrRecordNotFound)

	err := sit.shopImageService.SwitchCover(1)

	sit.NotNil(err)
}

func (sit *ShopImageServiceTestSuite) TestDeleteEntity() {
	sit.shopImageRepo.EXPECT().Delete(uint64(1)).Return(nil)

	err := sit.shopImageService.DeleteEntity(1)

	sit.Nil(err)
}

func (sit *ShopImageServiceTestSuite) TestDeleteEntityError() {
	sit.shopImageRepo.EXPECT().Delete(uint64(1)).Return(errors.New("fail"))

	err := sit.shopImageService.DeleteEntity(1)

	sit.NotNil(err)
}

func TestShopImageService(t *testing.T) {
	suite.Run(t, new(ShopImageServiceTestSuite))
}
