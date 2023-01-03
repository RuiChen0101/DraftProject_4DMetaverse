package entity

import "time"

type VerifySms struct {
	Id         uint64     `gorm:"primaryKey;autoIncrement;not null" json:"id"`
	Phone      string     `gorm:"size:16;not null" json:"phone"`
	VerifyCode string     `gorm:"size:6;not null" json:"verifyCode"`
	Status     int8       `gorm:"default:0" json:"status"`
	CreateAt   *time.Time `gorm:"autoCreateTime" json:"createAt"`
	UpdateAt   *time.Time `gorm:"autoUpdateTime" json:"updateAt"`
}

func (VerifySms) TableName() string {
	return "verify_sms"
}
