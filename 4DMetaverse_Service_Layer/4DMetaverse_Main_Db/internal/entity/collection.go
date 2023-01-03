package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PreviewCollection struct {
	Id              uuid.UUID `json:"id"`
	Title           string    `json:"title"`
	Type            uint8     `json:"type"`
	PreviewImageUrl string    `json:"previewImageUrl"`
	Available       int32     `json:"available"`
	TotalUnlocked   int64     `json:"totalUnlocked"`
}

type Collection struct {
	Unlocked         []UnlockedCollection   `gorm:"foreignKey:CollectionId" json:"-"`
	Id               uuid.UUID              `gorm:"primaryKey;not null" json:"id"`
	CollectionPoolId uint64                 `gorm:"index;not null" json:"collectionPoolId"`
	Title            string                 `json:"title,omitempty"`
	Type             uint8                  `gorm:"not null" json:"type"`
	PreviewImageUrl  string                 `gorm:"size:200" json:"previewImageUrl,omitempty"`
	UnlockedImageUrl string                 `gorm:"size:200" json:"unlockedImageUrl,omitempty"`
	MediaUrl         string                 `gorm:"size:200" json:"mediaUrl,omitempty"`
	Data             map[string]interface{} `gorm:"serializer:json" json:"data,omitempty"`
	Status           int8                   `gorm:"default:-1" json:"status"`
	Available        int32                  `gorm:"default:-1" json:"available"`
	TotalUnlocked    int64                  `gorm:"-" json:"totalUnlocked"`
	CreateAt         *time.Time             `gorm:"autoCreateTime" json:"createAt"`
	CreateBy         string                 `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt         *time.Time             `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy         string                 `gorm:"size:20" json:"updateBy,omitempty"`
}

func (c *Collection) BeforeCreate(tx *gorm.DB) error {
	if c.Id == uuid.Nil {
		c.Id = uuid.New()
	}
	return nil
}

func (c *Collection) ToPreview() PreviewCollection {
	return PreviewCollection{
		Id:              c.Id,
		Title:           c.Title,
		Type:            c.Type,
		PreviewImageUrl: c.PreviewImageUrl,
		Available:       c.Available,
		TotalUnlocked:   c.TotalUnlocked,
	}
}
