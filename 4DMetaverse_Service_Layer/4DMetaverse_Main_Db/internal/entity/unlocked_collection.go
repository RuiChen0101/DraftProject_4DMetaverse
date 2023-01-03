package entity

import (
	"time"

	"github.com/google/uuid"
)

type UnlockedCollection struct {
	Id           uint64     `gorm:"primaryKey;not null;autoIncrement" json:"id"`
	CollectionId uuid.UUID  `gorm:"index;not null" json:"collectionId"`
	UserId       string     `gorm:"size:20;index;not null" json:"userId"`
	CreateAt     *time.Time `gorm:"autoCreateTime" json:"createAt"`
	CreateBy     string     `gorm:"size:20" json:"createBy,omitempty"`
}
