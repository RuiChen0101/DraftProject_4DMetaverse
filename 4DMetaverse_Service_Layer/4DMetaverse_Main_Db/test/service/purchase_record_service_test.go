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

type PurchaseRecordServiceTestSuite struct {
	suite.Suite
	purchaseRecordService service.PurchaseRecordService
	purchaseRecordRepo    *mocks.MockPurchaseRecordRepo
}

func (prt *PurchaseRecordServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(prt.T())
	defer ctrl.Finish()

	prt.purchaseRecordRepo = mocks.NewMockPurchaseRecordRepo(ctrl)
	prt.purchaseRecordService = service.NewPurchaseRecordService(prt.purchaseRecordRepo)
}

func (prt *PurchaseRecordServiceTestSuite) TestGetEntitiesBySQL() {
	prt.purchaseRecordRepo.EXPECT().FindByNativeSQL("SELECT * FROM purchase_record").Return([]entity.PurchaseRecord{{
		Id: 1,
	}})

	result := prt.purchaseRecordService.GetEntitiesBySQL("SELECT * FROM purchase_record")

	prt.EqualValues([]entity.PurchaseRecord{{
		Id: 1,
	}}, result)
}

func (prt *PurchaseRecordServiceTestSuite) TestCreateEntity() {
	prt.purchaseRecordRepo.EXPECT().Create(&entity.PurchaseRecord{
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}).Return(nil)

	record, err := prt.purchaseRecordService.CreateEntity(service.PurchaseRecordCreateDTO{
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	})

	prt.Nil(err)
	prt.EqualValues(&entity.PurchaseRecord{
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, record)
}

func (prt *PurchaseRecordServiceTestSuite) TestCreateEntityError() {
	prt.purchaseRecordRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	record, err := prt.purchaseRecordService.CreateEntity(service.PurchaseRecordCreateDTO{
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	})

	prt.Nil(record)
	prt.NotNil(err)
}

func TestPurchaseRecord(t *testing.T) {
	suite.Run(t, new(PurchaseRecordServiceTestSuite))
}
