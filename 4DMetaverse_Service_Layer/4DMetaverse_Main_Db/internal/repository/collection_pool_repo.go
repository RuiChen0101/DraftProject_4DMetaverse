package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_collection_pool_repo.go -package=mocks . CollectionPoolRepo
type CollectionPoolRepo interface {
	Repository
	FindById(id uint64) (*entity.CollectionPool, error)
	CountCollection(id uint64) int64
	Create(collectionPool *entity.CollectionPool) error
	Update(id uint64, collectionPool *entity.CollectionPool) error
	Delete(id uint64) error
}

type collectionPoolRepo struct {
	db *gorm.DB
}

func NewCollectionPoolRepo(db *gorm.DB) CollectionPoolRepo {
	db.AutoMigrate(&entity.CollectionPool{})
	return &collectionPoolRepo{
		db: db,
	}
}

func (cpr *collectionPoolRepo) FindByNativeSQL(sql string) any {
	result := []entity.CollectionPool{}
	cpr.db.Raw(sql).Scan(&result)
	return result
}

func (cpr *collectionPoolRepo) FindById(id uint64) (*entity.CollectionPool, error) {
	collectionPool := entity.CollectionPool{}
	if err := cpr.db.
		Where("id = ?", id).
		Take(&collectionPool).Error; err != nil {
		return nil, err
	}
	return &collectionPool, nil
}

func (cpr *collectionPoolRepo) CountCollection(id uint64) int64 {
	var count int64
	cpr.db.
		Model(entity.Collection{}).
		Where("collection_pool_id = ?", id).
		Count(&count)
	return count
}

func (cpr *collectionPoolRepo) Create(collectionPool *entity.CollectionPool) error {
	return cpr.db.Create(collectionPool).Error
}

func (cpr *collectionPoolRepo) Update(id uint64, collectionPool *entity.CollectionPool) error {
	return cpr.db.Model(entity.CollectionPool{Id: id}).Updates(collectionPool).Error
}

func (cpr *collectionPoolRepo) Delete(id uint64) error {
	return cpr.db.Delete(entity.CollectionPool{Id: id}).Error
}
