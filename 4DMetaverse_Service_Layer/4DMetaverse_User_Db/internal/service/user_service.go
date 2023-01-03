package service

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
)

type UserCreateDTO struct {
	Id           string `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	LoginMethods uint16 `json:"loginMethods"`
	Role         uint8  `json:"role"`
	CreateBy     string `json:"createBy"`
}

type UserUpdateDTO struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	LoginMethods uint16 `json:"loginMethods"`
	Phone        string `json:"phone"`
	Role         uint8  `json:"role"`
	Flag         uint16 `json:"flag"`
	Status       int8   `json:"status"`
	UpdateBy     string `json:"updateBy"`
}

//go:generate mockgen -destination=../../test/mocks/mock_user_service.go -package=mocks . UserService
type UserService interface {
	Service
	GetEntity(id string) (*entity.User, error)
	GetEntityByEmail(email string) (*entity.User, error)
	CreateEntity(userDto UserCreateDTO) (*entity.User, error)
	UpdateEntity(id string, userDto UserUpdateDTO) (*entity.User, error)
}

type userService struct {
	userRepo repository.UserRepo
}

func NewUserService(userRepo repository.UserRepo) UserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (us *userService) GetEntitiesBySQL(sql string) any {
	return us.userRepo.FindByNativeSQL(sql)
}

func (us *userService) GetEntity(id string) (*entity.User, error) {
	user, err := us.userRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (us *userService) GetEntityByEmail(email string) (*entity.User, error) {
	user, err := us.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (us *userService) CreateEntity(userDto UserCreateDTO) (*entity.User, error) {
	user := entity.User{}
	dto.Map(&user, userDto)
	if err := us.userRepo.Create(&user); err != nil {
		return nil, err
	}
	return &user, nil
}

func (us *userService) UpdateEntity(id string, userDto UserUpdateDTO) (*entity.User, error) {
	user := entity.User{}
	dto.Map(&user, userDto)
	if err := us.userRepo.Update(id, &user); err != nil {
		return nil, err
	}
	u, _ := us.userRepo.FindById(id)
	return u, nil
}
