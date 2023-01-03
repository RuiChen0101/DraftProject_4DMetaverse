package repository

import (
	"4dmetaverse/storage_service/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_access_record_repo.go -package=mocks . AccessRecordRepo
type AccessRecordRepo interface {
	Repository
	Create(record *entity.AccessRecord) error
}

type accessRecordRepo struct {
	db *gorm.DB
}

func NewAccessRecordRepo(db *gorm.DB) AccessRecordRepo {
	db.AutoMigrate(&entity.AccessRecord{})
	return &accessRecordRepo{
		db: db,
	}
}

func (arr *accessRecordRepo) FindByNativeSQL(sql string) any {
	result := []entity.AccessRecord{}
	arr.db.Raw(sql).Scan(&result)
	return result
}

func (arr *accessRecordRepo) Create(record *entity.AccessRecord) error {
	err := arr.db.Create(record).Error
	return err
}
