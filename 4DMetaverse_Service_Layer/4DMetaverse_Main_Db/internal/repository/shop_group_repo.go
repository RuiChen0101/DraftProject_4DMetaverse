package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_shop_group_repo.go -package=mocks . ShopGroupRepo
type ShopGroupRepo interface {
	Repository
	FindById(id uuid.UUID) (*entity.ShopGroup, error)
	Create(shopGroup *entity.ShopGroup) error
	Update(id uuid.UUID, shopGroup *entity.ShopGroup) error
	Delete(id uuid.UUID) error
}

type shopGroupRepo struct {
	db *gorm.DB
}

func NewShopGroupRepo(db *gorm.DB) ShopGroupRepo {
	db.AutoMigrate(&entity.ShopGroup{})
	return &shopGroupRepo{
		db: db,
	}
}

func (sr *shopGroupRepo) FindByNativeSQL(sql string) any {
	result := []entity.ShopGroup{}
	sr.db.Raw(sql).Scan(&result)
	return result
}

func (sr *shopGroupRepo) FindById(id uuid.UUID) (*entity.ShopGroup, error) {
	shopGroup := entity.ShopGroup{}
	if err := sr.db.
		Where("id = ?", id).
		Take(&shopGroup).Error; err != nil {
		return nil, err
	}
	return &shopGroup, nil
}

func (sr *shopGroupRepo) Create(shopGroup *entity.ShopGroup) error {
	return sr.db.Create(shopGroup).Error
}

func (sr *shopGroupRepo) Update(id uuid.UUID, shopGroup *entity.ShopGroup) error {
	return sr.db.Model(entity.ShopGroup{Id: id}).Updates(shopGroup).Error
}

func (sr *shopGroupRepo) Delete(id uuid.UUID) error {
	return sr.db.Delete(entity.ShopGroup{Id: id}).Error
}
