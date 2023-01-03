package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_unlocked_collection_repo.go -package=mocks . UnlockedCollectionRepo
type UnlockedCollectionRepo interface {
	Repository
	Create(unlocked *entity.UnlockedCollection) error
	Delete(id uint64) error
}

type unlockedCollectionRepo struct {
	db *gorm.DB
}

func NewUnlockedCollectionRepo(db *gorm.DB) UnlockedCollectionRepo {
	db.AutoMigrate(&entity.UnlockedCollection{})
	return &unlockedCollectionRepo{
		db: db,
	}
}

func (ucr *unlockedCollectionRepo) FindByNativeSQL(sql string) any {
	result := []entity.UnlockedCollection{}
	ucr.db.Raw(sql).Scan(&result)
	return result
}

func (cr *unlockedCollectionRepo) Create(unlocked *entity.UnlockedCollection) error {
	return cr.db.Create(unlocked).Error
}

func (cr *unlockedCollectionRepo) Delete(id uint64) error {
	return cr.db.Delete(entity.UnlockedCollection{Id: id}).Error
}
