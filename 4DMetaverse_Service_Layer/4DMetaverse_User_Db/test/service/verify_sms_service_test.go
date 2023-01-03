package service_test

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/test/mocks"
	"errors"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type VerifySmsServiceTestSuite struct {
	suite.Suite
	verifySmsService service.VerifySmsService
	verifySmsRepo    *mocks.MockVerifySmsRepo
}

func (vst *VerifySmsServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(vst.T())
	defer ctrl.Finish()

	vst.verifySmsRepo = mocks.NewMockVerifySmsRepo(ctrl)
	vst.verifySmsService = service.NewVerifySmsService(vst.verifySmsRepo)
}

func (vst *VerifySmsServiceTestSuite) TestCreateEntity() {
	vst.verifySmsRepo.EXPECT().Create(&entity.VerifySms{
		Phone:      "0912345678",
		VerifyCode: "123456",
	}).Return(nil)

	record, err := vst.verifySmsService.CreateEntity(service.VerifySmsCreateDTO{
		Phone:      "0912345678",
		VerifyCode: "123456",
	})

	vst.Nil(err)
	vst.EqualValues(&entity.VerifySms{
		Phone:      "0912345678",
		VerifyCode: "123456",
	}, record)
}

func (vst *VerifySmsServiceTestSuite) TestCreateEntityError() {
	vst.verifySmsRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	record, err := vst.verifySmsService.CreateEntity(service.VerifySmsCreateDTO{
		Phone:      "0912345678",
		VerifyCode: "123456",
	})

	vst.Nil(record)
	vst.NotNil(err)
}

func (vst *VerifySmsServiceTestSuite) TestUpdateCodeUsed() {
	vst.verifySmsRepo.EXPECT().UpdateCodeUsed("0912345678", "123456").Return(nil)

	err := vst.verifySmsService.UpdateCodeUsed("0912345678", "123456")
	vst.Nil(err)
}

func (vst *VerifySmsServiceTestSuite) TestUpdateCodeUsedError() {
	vst.verifySmsRepo.EXPECT().UpdateCodeUsed("0912345678", "123456").Return(errors.New("fail"))

	err := vst.verifySmsService.UpdateCodeUsed("0912345678", "123456")
	vst.NotNil(err)
}

func TestVerifySmsService(t *testing.T) {
	suite.Run(t, new(VerifySmsServiceTestSuite))
}
