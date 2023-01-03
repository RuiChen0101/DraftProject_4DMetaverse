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

type LoginDeviceServiceTestSuite struct {
	suite.Suite
	loginDeviceService service.LoginDeviceService
	loginDeviceRepo    *mocks.MockLoginDeviceRepo
}

func (ldt *LoginDeviceServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(ldt.T())
	defer ctrl.Finish()

	ldt.loginDeviceRepo = mocks.NewMockLoginDeviceRepo(ctrl)
	ldt.loginDeviceService = service.NewLoginDeviceService(ldt.loginDeviceRepo)
}

func (ldt *LoginDeviceServiceTestSuite) TestCreateEntity() {
	ldt.loginDeviceRepo.EXPECT().Create(&entity.LoginDevice{
		Id:            "1234567890abcdefghijklmo",
		UserId:        "1234-5678-90ab-cdef",
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	}).Return(nil)

	device, err := ldt.loginDeviceService.CreateEntity(service.LoginDeviceCreateDTO{
		Id:            "1234567890abcdefghijklmo",
		UserId:        "1234-5678-90ab-cdef",
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	})

	ldt.Nil(err)
	ldt.EqualValues(&entity.LoginDevice{
		Id:            "1234567890abcdefghijklmo",
		UserId:        "1234-5678-90ab-cdef",
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	}, device)
}

func (ldt *LoginDeviceServiceTestSuite) TestCreateEntityError() {
	ldt.loginDeviceRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	device, err := ldt.loginDeviceService.CreateEntity(service.LoginDeviceCreateDTO{
		Id:            "1234567890abcdefghijklmo",
		UserId:        "1234-5678-90ab-cdef",
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	})

	ldt.Nil(device)
	ldt.NotNil(err)
}

func (ldt *LoginDeviceServiceTestSuite) TestUpdateEntity() {
	ldt.loginDeviceRepo.EXPECT().Update("1234567890abcdefghijklmo", &entity.LoginDevice{
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	}).Return(nil)
	ldt.loginDeviceRepo.EXPECT().FindById("1234567890abcdefghijklmo").Return(&entity.LoginDevice{
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	}, nil)

	device, err := ldt.loginDeviceService.UpdateEntity("1234567890abcdefghijklmo", service.LoginDeviceUpdateDTO{
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	})

	ldt.Nil(err)
	ldt.EqualValues(&entity.LoginDevice{
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	}, device)
}

func (ldt *LoginDeviceServiceTestSuite) TestUpdateEntityError() {
	ldt.loginDeviceRepo.EXPECT().Update("1234567890abcdefghijklmo", gomock.Any()).Return(errors.New("fail"))

	device, err := ldt.loginDeviceService.UpdateEntity("1234567890abcdefghijklmo", service.LoginDeviceUpdateDTO{
		DeviceType:    0,
		FirebaseToken: "firebase-token",
		OsVersion:     "TestOS",
		ModelName:     "TestDevice",
		DeviceId:      "1234567890",
	})

	ldt.Nil(device)
	ldt.NotNil(err)
}

func (ldt *LoginDeviceServiceTestSuite) TestDeleteEntity() {
	ldt.loginDeviceRepo.EXPECT().Delete("1234567890abcdefghijklmo").Return(nil)

	err := ldt.loginDeviceService.DeleteEntity("1234567890abcdefghijklmo")
	ldt.Nil(err)
}

func (ldt *LoginDeviceServiceTestSuite) TestDeleteEntityError() {
	ldt.loginDeviceRepo.EXPECT().Delete("1234567890abcdefghijklmo").Return(errors.New("nil"))

	err := ldt.loginDeviceService.DeleteEntity("1234567890abcdefghijklmo")
	ldt.NotNil(err)
}

func TestLoginDeviceService(t *testing.T) {
	suite.Run(t, new(LoginDeviceServiceTestSuite))
}
