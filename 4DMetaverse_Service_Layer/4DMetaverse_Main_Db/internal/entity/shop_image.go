package entity

import (
	"time"

	"github.com/google/uuid"
)

type ShopImage struct {
	Id       uint64     `gorm:"primaryKey;not null;autoIncrement" json:"id"`
	ShopId   uuid.UUID  `gorm:"index;not null" json:"shopId"`
	ImageUrl string     `gorm:"size:200" json:"imageUrl,omitempty"`
	IsCover  bool       `json:"isCover"`
	CreateAt *time.Time `gorm:"autoCreateTime" json:"createAt"`
	CreateBy string     `gorm:"size:20" json:"createBy,omitempty"`
}
