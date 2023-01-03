package service

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
)

type VerifySmsCreateDTO struct {
	Phone      string `json:"phone"`
	VerifyCode string `json:"verifyCode"`
}

//go:generate mockgen -destination=../../test/mocks/mock_verify_sms_service.go -package=mocks . VerifySmsService
type VerifySmsService interface {
	Service
	CreateEntity(recordDto VerifySmsCreateDTO) (*entity.VerifySms, error)
	UpdateCodeUsed(phone string, verifyCode string) error
}

type verifySmsService struct {
	verifySmsRepo repository.VerifySmsRepo
}

func NewVerifySmsService(verifySmsRepo repository.VerifySmsRepo) VerifySmsService {
	return &verifySmsService{
		verifySmsRepo: verifySmsRepo,
	}
}

func (vss *verifySmsService) GetEntitiesBySQL(sql string) any {
	return vss.verifySmsRepo.FindByNativeSQL(sql)
}

func (vss *verifySmsService) CreateEntity(recordDto VerifySmsCreateDTO) (*entity.VerifySms, error) {
	record := entity.VerifySms{}
	dto.Map(&record, recordDto)
	if err := vss.verifySmsRepo.Create(&record); err != nil {
		return nil, err
	}
	return &record, nil
}

func (vss *verifySmsService) UpdateCodeUsed(phone string, verifyCode string) error {
	err := vss.verifySmsRepo.UpdateCodeUsed(phone, verifyCode)
	return err
}
