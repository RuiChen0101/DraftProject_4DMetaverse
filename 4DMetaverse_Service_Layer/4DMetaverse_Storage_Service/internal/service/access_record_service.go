package service

import (
	"4dmetaverse/storage_service/internal/entity"
	"4dmetaverse/storage_service/internal/repository"

	"github.com/dranikpg/dto-mapper"
)

type AccessRecordCreateDto struct {
	FileId   string
	Result   int8
	CreateBy string
}

//go:generate mockgen -destination=../../test/mocks/mock_access_record_service.go -package=mocks . AccessRecordService
type AccessRecordService interface {
	Service
	Create(dto AccessRecordCreateDto) error
}

type accessRecordService struct {
	accessRecordRepo repository.AccessRecordRepo
}

func NewAccessRecordService(
	accessRecordRepo repository.AccessRecordRepo,
) AccessRecordService {
	return &accessRecordService{
		accessRecordRepo: accessRecordRepo,
	}
}

func (ars *accessRecordService) GetEntitiesBySQL(sql string) any {
	return ars.accessRecordRepo.FindByNativeSQL(sql)
}

func (ars *accessRecordService) Create(recordDto AccessRecordCreateDto) error {
	accessRecord := entity.AccessRecord{}
	dto.Map(&accessRecord, recordDto)
	return ars.accessRecordRepo.Create(&accessRecord)
}
