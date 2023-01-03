package entity

import "time"

type LoginDevice struct {
	Id            string     `gorm:"primaryKey;not null;size:30" json:"id"`
	UserId        string     `gorm:"index;not null;size:20" json:"userId"`
	DeviceType    uint8      `json:"deviceType"`
	FirebaseToken string     `json:"firebaseToken,omitempty"`
	OsVersion     string     `json:"osVersion,omitempty"`
	ModelName     string     `json:"modelName,omitempty"`
	DeviceId      string     `json:"deviceId,omitempty"`
	CreateAt      *time.Time `gorm:"autoCreateTime" json:"createAt"`
	RefreshAt     *time.Time `json:"refreshAt"`
}

func (LoginDevice) TableName() string {
	return "login_device"
}
