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
)

type PurchaseRecordControllerTestSuite struct {
	suite.Suite
	engine                *gin.Engine
	purchaseRecordService *mocks.MockPurchaseRecordService
}

func (prt *PurchaseRecordControllerTestSuite) SetupSuite() {
	ctrl := gomock.NewController(prt.T())
	defer ctrl.Finish()

	prt.purchaseRecordService = mocks.NewMockPurchaseRecordService(ctrl)
	sm := &service.ServiceManager{}
	sm.ReplaceService(map[string]service.Service{
		"purchase_record": prt.purchaseRecordService,
	})
	prt.engine = gin.Default()

	controller.RegisterPurchaseRecordApi(prt.engine, sm)
}

func (prt *PurchaseRecordControllerTestSuite) TestCreate() {
	prt.purchaseRecordService.EXPECT().CreateEntity(service.PurchaseRecordCreateDTO{
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}).Return(&entity.PurchaseRecord{
		Id:         1,
		UserId:     "5xvx-fgh9-ihjo-5g4c",
		SalePlanId: uuid.MustParse("49d254d0-1a10-4333-a4a6-3e29a842f6eb"),
	}, nil)

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/purchaseRecord/create", bytes.NewBufferString("{\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"salePlanId\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\"}"))
	prt.engine.ServeHTTP(r, req)

	prt.Equal(http.StatusOK, r.Code)
	prt.Equal("{\"id\":1,\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"salePlanId\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\",\"createAt\":null}", r.Body.String())
}

func (prt *PurchaseRecordControllerTestSuite) TestCreateFail() {
	prt.purchaseRecordService.EXPECT().CreateEntity(gomock.Any()).Return(nil, errors.New("fail"))

	r := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/purchaseRecord/create", bytes.NewBufferString("{\"userId\":\"5xvx-fgh9-ihjo-5g4c\",\"salePlanId\":\"49d254d0-1a10-4333-a4a6-3e29a842f6eb\"}"))
	prt.engine.ServeHTTP(r, req)

	prt.Equal(http.StatusBadRequest, r.Code)
}

func TestPurchaseRecordController(t *testing.T) {
	suite.Run(t, new(PurchaseRecordControllerTestSuite))
}
