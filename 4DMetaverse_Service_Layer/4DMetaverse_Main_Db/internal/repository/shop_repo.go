package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_shop_repo.go -package=mocks . ShopRepo
type ShopRepo interface {
	Repository
	FindById(id uuid.UUID) (*entity.Shop, error)
	Create(shop *entity.Shop) error
	Update(id uuid.UUID, shop *entity.Shop) error
	Delete(id uuid.UUID) error
}

type shopRepo struct {
	db *gorm.DB
}

func NewShopRepo(db *gorm.DB) ShopRepo {
	db.AutoMigrate(&entity.Shop{})
	return &shopRepo{
		db: db,
	}
}

func (sr *shopRepo) FindByNativeSQL(sql string) any {
	result := []entity.Shop{}
	sr.db.Raw(sql).Scan(&result)
	return result
}

func (sr *shopRepo) FindById(id uuid.UUID) (*entity.Shop, error) {
	shop := entity.Shop{}
	if err := sr.db.
		Where("id = ?", id).
		Take(&shop).Error; err != nil {
		return nil, err
	}
	return &shop, nil
}

func (sr *shopRepo) Create(shop *entity.Shop) error {
	return sr.db.Create(shop).Error
}

func (sr *shopRepo) Update(id uuid.UUID, shop *entity.Shop) error {
	return sr.db.Model(entity.Shop{Id: id}).Updates(shop).Error
}

func (sr *shopRepo) Delete(id uuid.UUID) error {
	return sr.db.Delete(entity.Shop{Id: id}).Error
}
