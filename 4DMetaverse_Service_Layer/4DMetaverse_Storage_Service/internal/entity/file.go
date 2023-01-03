package entity

import "time"

type File struct {
	Directory      Directory              `gorm:"foreignKey:DirectoryId;constraint:OnDelete:CASCADE;" json:"-"`
	Id             string                 `gorm:"primaryKey;not null;size:32" json:"id"`
	Name           string                 `gorm:"size:200;not null;uniqueIndex:idx_name_ext_dir" json:"name"`
	Extension      string                 `gorm:"size:15;uniqueIndex:idx_name_ext_dir" json:"extension,omitempty"`
	MimeType       string                 `gorm:"size:40" json:"mimeType,omitempty"`
	StoreLocation  string                 `gorm:"size:100" json:"storeLocation,omitempty"`
	SupplementData map[string]interface{} `gorm:"serializer:json" json:"metadata"`
	Size           uint64                 `gorm:"default:0" json:"size"`
	Permission     int8                   `gorm:"default:1" json:"permission"`
	DirectoryId    uint64                 `gorm:"default:1;uniqueIndex:idx_name_ext_dir" json:"directoryId"`
	PathPrefix     string                 `gorm:"-" json:"pathPrefix"`
	Sha            string                 `gorm:"size:130" json:"sha,omitempty"`
	PublicUrl      string                 `gorm:"size:150" json:"publicUrl,omitempty"`
	CreateAt       *time.Time             `gorm:"autoCreateTime" json:"createAt"`
	CreateBy       string                 `gorm:"size:20" json:"createBy,omitempty"`
	UpdateAt       *time.Time             `gorm:"autoUpdateTime" json:"updateAt"`
	UpdateBy       string                 `gorm:"size:20" json:"updateBy,omitempty"`
}
