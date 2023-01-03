package repository

import (
	"4dmetaverse/user_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_login_device_repo.go -package=mocks . LoginDeviceRepo
type LoginDeviceRepo interface {
	Repository
	FindById(id string) (*entity.LoginDevice, error)
	Create(loginDevice *entity.LoginDevice) error
	Update(id string, loginDevice *entity.LoginDevice) error
	Delete(id string) error
}

type loginDeviceRepo struct {
	db *gorm.DB
}

func NewLoginDeviceRepo(db *gorm.DB) LoginDeviceRepo {
	db.AutoMigrate(&entity.LoginDevice{})
	return &loginDeviceRepo{
		db: db,
	}
}

func (ldr *loginDeviceRepo) FindByNativeSQL(sql string) any {
	result := []entity.LoginDevice{}
	ldr.db.Raw(sql).Scan(&result)
	return result
}

func (ldr *loginDeviceRepo) FindById(id string) (*entity.LoginDevice, error) {
	device := entity.LoginDevice{}
	if err := ldr.db.
		Where("id = ?", id).
		Take(&device).Error; err != nil {
		return nil, err
	}
	return &device, nil
}

func (ldr *loginDeviceRepo) Create(loginDevice *entity.LoginDevice) error {
	err := ldr.db.Create(loginDevice).Error
	return err
}

func (ldr *loginDeviceRepo) Update(id string, loginDevice *entity.LoginDevice) error {
	err := ldr.db.Model(entity.LoginDevice{Id: id}).Updates(loginDevice).Error
	return err
}

func (ldr *loginDeviceRepo) Delete(id string) error {
	err := ldr.db.Delete(entity.LoginDevice{Id: id}).Error
	return err
}
