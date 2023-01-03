package repository

import (
	"4dmetaverse/user_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_verify_sms_repo.go -package=mocks . VerifySmsRepo
type VerifySmsRepo interface {
	Repository
	Create(record *entity.VerifySms) error
	UpdateCodeUsed(phone string, verifyCode string) error
}

type verifySmsRepo struct {
	db *gorm.DB
}

func NewVerifySmsRepo(db *gorm.DB) VerifySmsRepo {
	db.AutoMigrate(&entity.VerifySms{})
	return &verifySmsRepo{
		db: db,
	}
}

func (vsr *verifySmsRepo) FindByNativeSQL(sql string) any {
	result := []entity.VerifySms{}
	vsr.db.Raw(sql).Scan(&result)
	return result
}

func (vsr *verifySmsRepo) Create(record *entity.VerifySms) error {
	if err := vsr.db.Create(record).Error; err != nil {
		return err
	}
	return nil
}

func (vsr *verifySmsRepo) UpdateCodeUsed(phone string, verifyCode string) error {
	if err := vsr.db.Model(&entity.VerifySms{}).
		Where("phone = ?", phone).
		Where("verify_code = ?", verifyCode).
		Where("status = 0").
		Update("status", 1).Error; err != nil {
		return err
	}
	if err := vsr.db.Model(&entity.VerifySms{}).
		Where("phone = ?", phone).
		Where("verify_code != ?", verifyCode).
		Where("status = 0").
		Update("status", -1).Error; err != nil {
		return err
	}
	return nil
}
