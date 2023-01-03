package entity

import "time"

type Directory struct {
	ParentDir   *Directory `gorm:"foreignKey:ParentDirId" json:"-"`
	Id          uint64     `gorm:"primaryKey;autoIncrement;not null" json:"id"`
	ParentDirId *uint64    `json:"parentDirId"`
	PathPrefix  string     `gorm:"size:300;not null" json:"pathPrefix"`
	Name        string     `gorm:"size:50;not null" json:"name"`
	IsLocked    bool       `json:"isLocked"`
	CreateAt    *time.Time `gorm:"autoCreateTime" json:"createAt"`
}
