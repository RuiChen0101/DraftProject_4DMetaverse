package entity

import "time"

type Web3Wallet struct {
	Id       uint64     `gorm:"primaryKey;autoIncrement;not null" json:"id"`
	UserId   string     `gorm:"index;size:20;not null" json:"userId"`
	Type     string     `gorm:"not null" json:"type"`
	Address  string     `gorm:"index;size:100;not null" json:"address"`
	Nonce    string     `gorm:"not null" json:"nonce"`
	CreateAt *time.Time `gorm:"autoCreateTime" json:"createAt"`
}

func (Web3Wallet) TableName() string {
	return "web3_wallet"
}
