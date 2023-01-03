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

type UserServiceTestSuite struct {
	suite.Suite
	userService service.UserService
	userRepo    *mocks.MockUserRepo
}

func (ust *UserServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(ust.T())
	defer ctrl.Finish()

	ust.userRepo = mocks.NewMockUserRepo(ctrl)
	ust.userService = service.NewUserService(ust.userRepo)
}

func (ust *UserServiceTestSuite) TestCreateEntity() {
	ust.userRepo.EXPECT().Create(&entity.User{
		Id:           "1234-5678-90ab-cdef",
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Role:         1,
		CreateBy:     "1234-5678-90ab-cdef",
	}).Return(nil)

	user, err := ust.userService.CreateEntity(service.UserCreateDTO{
		Id:           "1234-5678-90ab-cdef",
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Role:         1,
		CreateBy:     "1234-5678-90ab-cdef",
	})

	ust.Nil(err)
	ust.EqualValues(&entity.User{
		Id:           "1234-5678-90ab-cdef",
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Role:         1,
		CreateBy:     "1234-5678-90ab-cdef",
	}, user)
}

func (ust *UserServiceTestSuite) TestCreateEntityError() {
	ust.userRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	user, err := ust.userService.CreateEntity(service.UserCreateDTO{
		Id:           "1234-5678-90ab-cdef",
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Role:         1,
		CreateBy:     "1234-5678-90ab-cdef",
	})

	ust.Nil(user)
	ust.NotNil(err)
}

func (ust *UserServiceTestSuite) TestUpdateEntity() {
	ust.userRepo.EXPECT().Update("1234-5678-90ab-cdef", &entity.User{
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Phone:        "0912345678",
		Role:         1,
		Flag:         0,
		Status:       1,
		UpdateBy:     "1234-5678-90ab-cdef",
	}).Return(nil)
	ust.userRepo.EXPECT().FindById("1234-5678-90ab-cdef").Return(&entity.User{
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Phone:        "0912345678",
		Role:         1,
		Flag:         0,
		Status:       1,
		UpdateBy:     "1234-5678-90ab-cdef",
	}, nil)

	user, err := ust.userService.UpdateEntity("1234-5678-90ab-cdef", service.UserUpdateDTO{
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Phone:        "0912345678",
		Role:         1,
		Flag:         0,
		Status:       1,
		UpdateBy:     "1234-5678-90ab-cdef",
	})

	ust.Nil(err)
	ust.EqualValues(&entity.User{
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Phone:        "0912345678",
		Role:         1,
		Flag:         0,
		Status:       1,
		UpdateBy:     "1234-5678-90ab-cdef",
	}, user)
}

func (ust *UserServiceTestSuite) TestUpdateEntityError() {
	ust.userRepo.EXPECT().Update("1234-5678-90ab-cdef", gomock.Any()).Return(errors.New("fail"))

	user, err := ust.userService.UpdateEntity("1234-5678-90ab-cdef", service.UserUpdateDTO{
		Name:         "name",
		Email:        "test@email.com",
		Password:     "hashed password",
		LoginMethods: 1,
		Phone:        "0912345678",
		Role:         1,
		Flag:         0,
		Status:       1,
		UpdateBy:     "1234-5678-90ab-cdef",
	})

	ust.Nil(user)
	ust.NotNil(err)
}

func (ust *UserServiceTestSuite) TestGetEntity() {
	ust.userRepo.EXPECT().FindById("1234-5678-90ab-cdef").Return(&entity.User{
		Id: "1234-5678-90ab-cdef",
	}, nil)

	user, err := ust.userService.GetEntity("1234-5678-90ab-cdef")
	ust.Nil(err)
	ust.EqualValues(&entity.User{
		Id: "1234-5678-90ab-cdef",
	}, user)
}

func (ust *UserServiceTestSuite) TestGetEntityError() {
	ust.userRepo.EXPECT().FindById("1234-5678-90ab-cdef").Return(nil, errors.New("fail"))

	user, err := ust.userService.GetEntity("1234-5678-90ab-cdef")
	ust.NotNil(err)
	ust.Nil(user)
}

func (ust *UserServiceTestSuite) TestGetEntityByEmail() {
	ust.userRepo.EXPECT().FindByEmail("test@email.com").Return(&entity.User{
		Id: "1234-5678-90ab-cdef",
	}, nil)

	user, err := ust.userService.GetEntityByEmail("test@email.com")
	ust.Nil(err)
	ust.EqualValues(&entity.User{
		Id: "1234-5678-90ab-cdef",
	}, user)
}

func (ust *UserServiceTestSuite) TestGetEntityByEmailError() {
	ust.userRepo.EXPECT().FindByEmail("test@email.com").Return(nil, errors.New("fail"))

	user, err := ust.userService.GetEntityByEmail("test@email.com")
	ust.NotNil(err)
	ust.Nil(user)
}

func TestUserService(t *testing.T) {
	suite.Run(t, new(UserServiceTestSuite))
}
