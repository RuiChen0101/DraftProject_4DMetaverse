package repository

import (
	"4dmetaverse/main_db/internal/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_sale_plan_repo.go -package=mocks . SalePlanRepo
type SalePlanRepo interface {
	Repository
	FindById(id uuid.UUID) (*entity.SalePlan, error)
	FindDefaultSalePlan(id uuid.UUID) (*entity.SalePlan, error)
	Create(salePlan *entity.SalePlan) error
	SetCollections(id uuid.UUID, collections []entity.Collection) error
	Update(id uuid.UUID, salePlan *entity.SalePlan) error
	Delete(id uuid.UUID) error
}

type salePlanRepo struct {
	db *gorm.DB
}

func NewSalePlanRepo(db *gorm.DB) SalePlanRepo {
	db.AutoMigrate(&entity.SalePlan{})
	return &salePlanRepo{
		db: db,
	}
}

func (spr *salePlanRepo) FindByNativeSQL(sql string) any {
	result := []entity.SalePlan{}
	spr.db.Raw(sql).Scan(&result)
	return result
}

func (spr *salePlanRepo) FindById(id uuid.UUID) (*entity.SalePlan, error) {
	salePlan := entity.SalePlan{}
	if err := spr.db.
		Where("id = ?", id).
		Take(&salePlan).Error; err != nil {
		return nil, err
	}
	return &salePlan, nil
}

func (spr *salePlanRepo) FindDefaultSalePlan(id uuid.UUID) (*entity.SalePlan, error) {
	salePlan := entity.SalePlan{}
	if err := spr.db.
		Where("is_default = 1").
		Where("shop_id = ?", id).
		Take(&salePlan).Error; err != nil {
		return nil, err
	}
	return &salePlan, nil
}

func (spr *salePlanRepo) Create(salePlan *entity.SalePlan) error {
	return spr.db.Create(salePlan).Error
}

func (spr *salePlanRepo) SetCollections(id uuid.UUID, collections []entity.Collection) error {
	return spr.db.
		Model(&entity.SalePlan{Id: id}).
		Association("Collections").
		Replace(collections)
}

func (spr *salePlanRepo) Update(id uuid.UUID, salePlan *entity.SalePlan) error {
	return spr.db.Model(entity.SalePlan{Id: id}).Updates(salePlan).Error
}

func (spr *salePlanRepo) Delete(id uuid.UUID) error {
	return spr.db.Delete(entity.SalePlan{Id: id}).Error
}
