package entity

import "time"

type CollectionPool struct {
	Collections   []Collection `gorm:"foreignKey:CollectionPoolId" json:"-"`
	Id            uint64       `gorm:"primaryKey;not null;autoIncrement" json:"id"`
	Name          string       `gorm:"size:50" json:"name,omitempty"`
	CoverImageUrl string       `gorm:"size:200" json:"coverImageUrl,omitempty"`
	CreateAt      *time.Time   `gorm:"autoCreateTime" json:"createAt"`
	CreateBy      string       `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt      *time.Time   `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy      string       `gorm:"size:20" json:"updateBy,omitempty"`
}
