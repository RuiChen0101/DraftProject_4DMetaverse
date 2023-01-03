package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_collection_repo.go -package=mocks . CollectionRepo
type CollectionRepo interface {
	Repository
	FindById(id uuid.UUID) (*entity.Collection, error)
	ListBySalePlanId(shopId uuid.UUID) ([]entity.Collection, error)
	CountUnlocked(id uuid.UUID) int64
	Create(collection *entity.Collection) error
	Update(id uuid.UUID, collection *entity.Collection) error
	Delete(id uuid.UUID) error
}

type collectionRepo struct {
	db *gorm.DB
}

func NewCollectionRepo(db *gorm.DB) CollectionRepo {
	db.AutoMigrate(&entity.Collection{})
	return &collectionRepo{
		db: db,
	}
}

func (cr *collectionRepo) FindByNativeSQL(sql string) any {
	result := []entity.Collection{}
	cr.db.Raw(sql).Scan(&result)
	return result
}

func (cr *collectionRepo) FindById(id uuid.UUID) (*entity.Collection, error) {
	collection := entity.Collection{}
	if err := cr.db.
		Where("id = ?", id).
		Take(&collection).Error; err != nil {
		return nil, err
	}
	return &collection, nil
}

func (cr *collectionRepo) ListBySalePlanId(shopId uuid.UUID) ([]entity.Collection, error) {
	collections := []entity.Collection{}
	if err := cr.db.
		Model(&entity.SalePlan{Id: shopId}).
		Association("Collections").
		Find(&collections); err != nil {
		return nil, err
	}
	return collections, nil
}

func (cr *collectionRepo) CountUnlocked(id uuid.UUID) int64 {
	var count int64
	cr.db.
		Model(entity.UnlockedCollection{}).
		Where("collection_id = ?", id).
		Count(&count)
	return count
}

func (cr *collectionRepo) Create(collection *entity.Collection) error {
	return cr.db.Create(collection).Error
}

func (cr *collectionRepo) Update(id uuid.UUID, collection *entity.Collection) error {
	return cr.db.Model(entity.Collection{Id: id}).Updates(collection).Error
}

func (cr *collectionRepo) Delete(id uuid.UUID) error {
	return cr.db.Delete(entity.Collection{Id: id}).Error
}
