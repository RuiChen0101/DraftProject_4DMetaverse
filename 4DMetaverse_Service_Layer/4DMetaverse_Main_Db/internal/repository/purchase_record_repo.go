package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_purchase_record_repo.go -package=mocks . PurchaseRecordRepo
type PurchaseRecordRepo interface {
	Repository
	Create(record *entity.PurchaseRecord) error
}

type purchaseRecord struct {
	db *gorm.DB
}

func NewPurchaseRecordRepo(db *gorm.DB) PurchaseRecordRepo {
	db.AutoMigrate(&entity.PurchaseRecord{})
	return &purchaseRecord{
		db: db,
	}
}

func (pr *purchaseRecord) FindByNativeSQL(sql string) any {
	result := []entity.PurchaseRecord{}
	pr.db.Raw(sql).Scan(&result)
	return result
}

func (pr *purchaseRecord) Create(record *entity.PurchaseRecord) error {
	return pr.db.Create(record).Error
}
