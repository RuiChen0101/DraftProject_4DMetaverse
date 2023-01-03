package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SalePlan struct {
	PurchaseRecord     []PurchaseRecord    `gorm:"foreignKey:SalePlanId" json:"-"`
	Collections        []Collection        `gorm:"many2many:sale_plan_collections" json:"-"`
	PreviewCollections []PreviewCollection `gorm:"-" json:"previewCollection"`
	Id                 uuid.UUID           `gorm:"primaryKey;not null" json:"id"`
	ShopId             uuid.UUID           `gorm:"index;not null" json:"shopId"`
	Name               string              `gorm:"size:50" json:"name,omitempty"`
	Price              uint64              `gorm:"not null" json:"price"`
	Status             int8                `gorm:"default:-1" json:"status"`
	IsDefault          bool                `json:"isDefault"`
	CreateAt           *time.Time          `gorm:"autoCreateTime" json:"createAt"`
	CreateBy           string              `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt           *time.Time          `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy           string              `gorm:"size:20" json:"updateBy,omitempty"`
}

func (s *SalePlan) BeforeCreate(tx *gorm.DB) error {
	if s.Id == uuid.Nil {
		s.Id = uuid.New()
	}
	return nil
}
