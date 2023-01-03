package entity

import "time"

type AccessRecord struct {
	Id       uint64     `gorm:"primaryKey;autoIncrement;not null" json:"id"`
	FileId   string     `gorm:"index;size:32;not null" json:"fileId"`
	Result   int8       `gorm:"default:1" json:"result"`
	CreateAt *time.Time `gorm:"autoCreateTime" json:"createAt"`
	CreateBy string     `gorm:"size:20" json:"createBy,omitempty"`
}
