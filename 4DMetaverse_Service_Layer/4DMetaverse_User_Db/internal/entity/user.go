package entity

import "time"

type User struct {
	Wallets      []Web3Wallet  `gorm:"foreignKey:UserId" json:"wallets"`
	LoginDevice  []LoginDevice `gorm:"foreignKey:UserId" json:"-"`
	Id           string        `gorm:"primaryKey;not null;size:20" json:"id"`
	Name         string        `gorm:"not null;size:100" json:"name"`
	Email        string        `gorm:"index;unique;not null;size:100" json:"email"`
	Password     string        `gorm:"size:70" json:"password,omitempty"`
	LoginMethods uint16        `gorm:"default:0" json:"loginMethods"`
	Phone        string        `gorm:"index,unique;size:16" json:"phone"`
	Role         uint8         `gorm:"default:1" json:"role"`
	Flag         uint16        `gorm:"default:0" json:"flag"`
	Status       int8          `gorm:"default:1" json:"status"`
	CreateAt     *time.Time    `gorm:"autoCreateTime" json:"createAt"`
	CreateBy     string        `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt     *time.Time    `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy     string        `gorm:"size:20" json:"updateBy,omitempty"`
}

func (User) TableName() string {
	return "user"
}
