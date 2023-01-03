package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ShopGroup struct {
	Shops         []Shop     `gorm:"foreignKey:GroupId" json:"-"`
	Id            uuid.UUID  `gorm:"primaryKey;not null" json:"id"`
	Title         string     `gorm:"size:50" json:"title,omitempty"`
	Tags          []string   `gorm:"serializer:json" json:"tags"`
	CoverImageUrl string     `gorm:"size:200" json:"coverImageUrl,omitempty"`
	Status        int8       `gorm:"default:-1" json:"status"`
	CreateAt      *time.Time `gorm:"autoCreateTime" json:"createAt"`
	CreateBy      string     `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt      *time.Time `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy      string     `gorm:"size:20" json:"updateBy,omitempty"`
}

func (s *ShopGroup) BeforeCreate(tx *gorm.DB) error {
	if s.Id == uuid.Nil {
		s.Id = uuid.New()
	}
	return nil
}
