package entity

import (
	"time"

	"github.com/google/uuid"
)

type PurchaseRecord struct {
	Id         uint64     `gorm:"primaryKey;not null;autoIncrement" json:"id"`
	UserId     string     `gorm:"size:20;index;not null" json:"userId"`
	SalePlanId uuid.UUID  `gorm:"index;not null" json:"salePlanId"`
	CreateAt   *time.Time `gorm:"autoCreateTime" json:"createAt"`
}
