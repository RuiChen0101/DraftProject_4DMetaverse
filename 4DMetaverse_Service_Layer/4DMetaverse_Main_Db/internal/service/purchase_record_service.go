package service

import (
	"4dmetaverse/main_db/internal/entity"
	"4dmetaverse/main_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
	"github.com/google/uuid"
)

type PurchaseRecordCreateDTO struct {
	UserId     string    `json:"userId"`
	SalePlanId uuid.UUID `json:"salePlanId"`
}

//go:generate mockgen -destination=../../test/mocks/mock_purchase_record_service.go -package=mocks . PurchaseRecordService
type PurchaseRecordService interface {
	Service
	CreateEntity(recordDto PurchaseRecordCreateDTO) (*entity.PurchaseRecord, error)
}

type purchaseRecordService struct {
	purchaseRecordRepo repository.PurchaseRecordRepo
}

func NewPurchaseRecordService(purchaseRecordRepo repository.PurchaseRecordRepo) PurchaseRecordService {
	return &purchaseRecordService{
		purchaseRecordRepo: purchaseRecordRepo,
	}
}

func (prs *purchaseRecordService) GetEntitiesBySQL(sql string) any {
	return prs.purchaseRecordRepo.FindByNativeSQL(sql)
}

func (prs *purchaseRecordService) CreateEntity(recordDto PurchaseRecordCreateDTO) (*entity.PurchaseRecord, error) {
	record := entity.PurchaseRecord{}
	dto.Map(&record, recordDto)
	if err := prs.purchaseRecordRepo.Create(&record); err != nil {
		return nil, err
	}
	return &record, nil
}
