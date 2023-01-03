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

type SalePlanServiceTestSuite struct {
	suite.Suite
	salePlanService   service.SalePlanService
	salePlanRepo      *mocks.MockSalePlanRepo
	collectionService *mocks.MockCollectionService
}

func (spt *SalePlanServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(spt.T())
	defer ctrl.Finish()

	spt.salePlanRepo = mocks.NewMockSalePlanRepo(ctrl)
	spt.collectionService = mocks.NewMockCollectionService(ctrl)
	spt.salePlanService = service.NewSalePlanService(spt.salePlanRepo, spt.collectionService)
}

func (spt *SalePlanServiceTestSuite) TestGetEntitiesBySQL() {
	spt.collectionService.EXPECT().GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return([]entity.PreviewCollection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		PreviewImageUrl: "http://image.jpg",
	}}, nil)
	spt.salePlanRepo.EXPECT().FindByNativeSQL("SELECT * FROM sale_plan").Return([]entity.SalePlan{{
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}})

	result := spt.salePlanService.GetEntitiesBySQL("SELECT * FROM sale_plan")

	spt.EqualValues([]entity.SalePlan{{
		PreviewCollections: []entity.PreviewCollection{{
			Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
			PreviewImageUrl: "http://image.jpg",
		}},
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}}, result)
}

func (spt *SalePlanServiceTestSuite) TestGetEntity() {
	spt.collectionService.EXPECT().GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return([]entity.PreviewCollection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		PreviewImageUrl: "http://image.jpg",
	}}, nil)
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(&entity.SalePlan{
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, nil)

	salePlan, err := spt.salePlanService.GetEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(err)
	spt.EqualValues(&entity.SalePlan{
		PreviewCollections: []entity.PreviewCollection{{
			Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
			PreviewImageUrl: "http://image.jpg",
		}},
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, salePlan)
}

func (spt *SalePlanServiceTestSuite) TestGetEntityError() {
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil, errors.New("fail"))

	salePlan, err := spt.salePlanService.GetEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(salePlan)
	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestGetDefaultSalePlan() {
	spt.collectionService.EXPECT().GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return([]entity.PreviewCollection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		PreviewImageUrl: "http://image.jpg",
	}}, nil)
	spt.salePlanRepo.EXPECT().FindDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.SalePlan{
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, nil)

	salePlan, err := spt.salePlanService.GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	spt.Nil(err)
	spt.EqualValues(&entity.SalePlan{
		PreviewCollections: []entity.PreviewCollection{{
			Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
			PreviewImageUrl: "http://image.jpg",
		}},
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, salePlan)
}

func (spt *SalePlanServiceTestSuite) TestGetDefaultSalePlanError() {
	spt.salePlanRepo.EXPECT().FindDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, errors.New("fail"))

	salePlan, err := spt.salePlanService.GetDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"))

	spt.Nil(salePlan)
	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestCreateEntity() {
	spt.collectionService.EXPECT().GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil, errors.New("fail"))
	spt.salePlanRepo.EXPECT().Create(&entity.SalePlan{
		Id:        uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:    uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		Name:      "SalePlanName",
		Price:     100,
		IsDefault: true,
		CreateBy:  "createBy",
	}).Return(nil)

	salePlan, err := spt.salePlanService.CreateEntity(service.SalePlanCreateDTO{
		Id:        uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:    uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		Name:      "SalePlanName",
		Price:     100,
		IsDefault: true,
		CreateBy:  "createBy",
	})

	spt.Nil(err)
	spt.EqualValues(&entity.SalePlan{
		Id:        uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:    uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		Name:      "SalePlanName",
		Price:     100,
		IsDefault: true,
		CreateBy:  "createBy",
	}, salePlan)
}

func (spt *SalePlanServiceTestSuite) TestCreateEntityError() {
	spt.salePlanRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	salePlan, err := spt.salePlanService.CreateEntity(service.SalePlanCreateDTO{
		Id:       uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:   uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		Name:     "SalePlanName",
		Price:    100,
		CreateBy: "createBy",
	})

	spt.Nil(salePlan)
	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestSetCollection() {
	spt.salePlanRepo.EXPECT().SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), []entity.Collection{{
		Id:   uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		Data: map[string]interface{}{},
	}}).Return(nil)

	err := spt.salePlanService.SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanSetCollectionsDTO{
		CollectionIds: []uuid.UUID{
			uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		},
	})

	spt.Nil(err)
}

func (spt *SalePlanServiceTestSuite) TestSetCollectionError() {
	spt.salePlanRepo.EXPECT().SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), gomock.Any()).Return(errors.New("fail"))

	err := spt.salePlanService.SetCollections(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanSetCollectionsDTO{
		CollectionIds: []uuid.UUID{
			uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		},
	})

	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestUpdateEntity() {
	spt.collectionService.EXPECT().GetPreviewsBySalePlanId(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return([]entity.PreviewCollection{{
		Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
		PreviewImageUrl: "http://image.jpg",
	}}, nil)
	spt.salePlanRepo.EXPECT().Update(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), &entity.SalePlan{
		Name:      "SalePlanName",
		Price:     300,
		Status:    1,
		IsDefault: false,
		UpdateBy:  "updateBy",
	}).Return(nil)
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(&entity.SalePlan{
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, nil)

	salePlan, err := spt.salePlanService.UpdateEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanUpdateDTO{
		Name:     "SalePlanName",
		Price:    300,
		Status:   1,
		UpdateBy: "updateBy",
	})

	spt.Nil(err)
	spt.EqualValues(&entity.SalePlan{
		PreviewCollections: []entity.PreviewCollection{{
			Id:              uuid.MustParse("00a95659-4b52-490a-ab27-d1d08d16832a"),
			PreviewImageUrl: "http://image.jpg",
		}},
		Id: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, salePlan)
}

func (spt *SalePlanServiceTestSuite) TestUpdateEntityError() {
	spt.salePlanRepo.EXPECT().Update(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), gomock.Any()).Return(errors.New("fail"))

	salePlan, err := spt.salePlanService.UpdateEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), service.SalePlanUpdateDTO{
		Name:     "SalePlanName",
		Price:    300,
		Status:   1,
		UpdateBy: "updateBy",
	})

	spt.Nil(salePlan)
	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestSwitchDefaultWithOld() {
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(&entity.SalePlan{
		Id:        uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:    uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		IsDefault: false,
	}, nil)
	spt.salePlanRepo.EXPECT().FindDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(&entity.SalePlan{
		Id:        uuid.MustParse("3236549a-ff1c-476e-a010-ece77bfb4447"),
		IsDefault: true,
	}, nil)
	spt.salePlanRepo.EXPECT().Update(uuid.MustParse("3236549a-ff1c-476e-a010-ece77bfb4447"), &entity.SalePlan{IsDefault: false}).Return(nil)
	spt.salePlanRepo.EXPECT().Update(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), &entity.SalePlan{IsDefault: true}).Return(nil)

	err := spt.salePlanService.SwitchDefault(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(err)
}

func (spt *SalePlanServiceTestSuite) TestSwitchDefaultWithoutOld() {
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(&entity.SalePlan{
		Id:        uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
		ShopId:    uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81"),
		IsDefault: false,
	}, nil)
	spt.salePlanRepo.EXPECT().FindDefaultSalePlan(uuid.MustParse("31e3aae3-b9e1-4bc5-a8cb-595210859e81")).Return(nil, gorm.ErrRecordNotFound)
	spt.salePlanRepo.EXPECT().Update(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"), &entity.SalePlan{IsDefault: true}).Return(nil)

	err := spt.salePlanService.SwitchDefault(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(err)
}

func (spt *SalePlanServiceTestSuite) TestSwitchDefaultGetError() {
	spt.salePlanRepo.EXPECT().FindById(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil, gorm.ErrRecordNotFound)

	err := spt.salePlanService.SwitchDefault(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.NotNil(err)
}

func (spt *SalePlanServiceTestSuite) TestDeleteEntity() {
	spt.salePlanRepo.EXPECT().Delete(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil)

	err := spt.salePlanService.DeleteEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(err)
}

func (spt *SalePlanServiceTestSuite) TestDeleteEntityError() {
	spt.salePlanRepo.EXPECT().Delete(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb")).Return(nil)

	err := spt.salePlanService.DeleteEntity(uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"))

	spt.Nil(err)
}

func TestSalePlanService(t *testing.T) {
	suite.Run(t, new(SalePlanServiceTestSuite))
}
