package service

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/repository"
	"time"

	"github.com/dranikpg/dto-mapper"
)

type LoginDeviceCreateDTO struct {
	Id            string `json:"id"`
	UserId        string `json:"userId"`
	DeviceType    uint8  `json:"deviceType"`
	FirebaseToken string `json:"firebaseToken"`
	OsVersion     string `json:"osVersion"`
	ModelName     string `json:"modelName"`
	DeviceId      string `json:"deviceId"`
}

type LoginDeviceUpdateDTO struct {
	DeviceType    uint8  `json:"deviceType"`
	FirebaseToken string `json:"firebaseToken"`
	OsVersion     string `json:"osVersion"`
	ModelName     string `json:"modelName"`
	DeviceId      string `json:"deviceId"`
}

//go:generate mockgen -destination=../../test/mocks/mock_login_device_service.go -package=mocks . LoginDeviceService
type LoginDeviceService interface {
	Service
	CreateEntity(deviceDto LoginDeviceCreateDTO) (*entity.LoginDevice, error)
	UpdateEntity(id string, deviceDto LoginDeviceUpdateDTO) (*entity.LoginDevice, error)
	UpdateRefreshTime(id string) error
	DeleteEntity(id string) error
}

type loginDeviceService struct {
	loginDeviceRepo repository.LoginDeviceRepo
}

func NewLoginDeviceService(loginDeviceRepo repository.LoginDeviceRepo) LoginDeviceService {
	return &loginDeviceService{
		loginDeviceRepo: loginDeviceRepo,
	}
}

func (lds *loginDeviceService) GetEntitiesBySQL(sql string) any {
	return lds.loginDeviceRepo.FindByNativeSQL(sql)
}

func (lds *loginDeviceService) CreateEntity(deviceDto LoginDeviceCreateDTO) (*entity.LoginDevice, error) {
	device := entity.LoginDevice{}
	dto.Map(&device, deviceDto)
	if err := lds.loginDeviceRepo.Create(&device); err != nil {
		return nil, err
	}
	return &device, nil
}

func (lds *loginDeviceService) UpdateEntity(id string, deviceDto LoginDeviceUpdateDTO) (*entity.LoginDevice, error) {
	device := entity.LoginDevice{}
	dto.Map(&device, deviceDto)
	if err := lds.loginDeviceRepo.Update(id, &device); err != nil {
		return nil, err
	}
	d, _ := lds.loginDeviceRepo.FindById(id)
	return d, nil
}

func (lds *loginDeviceService) UpdateRefreshTime(id string) error {
	now := time.Now()
	device := entity.LoginDevice{
		RefreshAt: &now,
	}
	err := lds.loginDeviceRepo.Update(id, &device)
	return err
}

func (lds *loginDeviceService) DeleteEntity(id string) error {
	err := lds.loginDeviceRepo.Delete(id)
	return err
}
