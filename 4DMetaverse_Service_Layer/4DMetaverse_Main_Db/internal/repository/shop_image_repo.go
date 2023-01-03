package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_shop_image_repo.go -package=mocks . ShopImageRepo
type ShopImageRepo interface {
	Repository
	FindById(id uint64) (*entity.ShopImage, error)
	FindCoverImage(shopId uuid.UUID) (*entity.ShopImage, error)
	Create(shopImage *entity.ShopImage) error
	Update(id uint64, shopImage *entity.ShopImage) error
	Delete(id uint64) error
}

type shopImageRepo struct {
	db *gorm.DB
}

func NewShopImageRepo(db *gorm.DB) ShopImageRepo {
	db.AutoMigrate(&entity.ShopImage{})
	return &shopImageRepo{
		db: db,
	}
}

func (sir *shopImageRepo) FindByNativeSQL(sql string) any {
	result := []entity.ShopImage{}
	sir.db.Raw(sql).Scan(&result)
	return result
}

func (sir *shopImageRepo) FindById(id uint64) (*entity.ShopImage, error) {
	shopImage := entity.ShopImage{}
	if err := sir.db.
		Where("id = ?", id).
		Take(&shopImage).Error; err != nil {
		return nil, err
	}
	return &shopImage, nil
}

func (sir *shopImageRepo) FindCoverImage(shopId uuid.UUID) (*entity.ShopImage, error) {
	shopImage := entity.ShopImage{}
	if err := sir.db.
		Where("shop_id = ?", shopId).
		Where("is_cover = 1").
		Take(&shopImage).Error; err != nil {
		return nil, err
	}
	return &shopImage, nil
}

func (sir *shopImageRepo) Create(shopImage *entity.ShopImage) error {
	return sir.db.Create(shopImage).Error
}

func (sir *shopImageRepo) Update(id uint64, shopImage *entity.ShopImage) error {
	return sir.db.Model(&entity.ShopImage{Id: id}).Updates(shopImage).Error
}

func (sir *shopImageRepo) Delete(id uint64) error {
	return sir.db.Delete(entity.ShopImage{Id: id}).Error
}
