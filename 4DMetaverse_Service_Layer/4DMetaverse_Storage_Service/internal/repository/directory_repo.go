package repository

import (
	"4dmetaverse/storage_service/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_directory_repo.go -package=mocks . DirectoryRepo
type DirectoryRepo interface {
	Repository
	ListByParentId(parentId *uint64) ([]entity.Directory, error)
	ListByPathPrefix(path string) ([]entity.Directory, error)
	FindById(id uint64) (*entity.Directory, error)
	FindByFullPath(prefix string, name string) (*entity.Directory, error)
	Create(dir *entity.Directory) error
	Update(id uint64, dir *entity.Directory) error
	Delete(id uint64) error
}

type directoryRepo struct {
	db *gorm.DB
}

func NewDirectoryRepo(db *gorm.DB) DirectoryRepo {
	db.AutoMigrate(&entity.Directory{})
	return &directoryRepo{
		db: db,
	}
}

func (dr *directoryRepo) FindByNativeSQL(sql string) any {
	result := []entity.Directory{}
	dr.db.Raw(sql).Scan(&result)
	return result
}

func (dr *directoryRepo) ListByParentId(parentId *uint64) ([]entity.Directory, error) {
	dir := []entity.Directory{}
	tx := dr.db
	if parentId == nil {
		tx = tx.Where("parent_dir_id IS NULL")
	} else {
		tx = tx.Where("parent_dir_id = ?", parentId)
	}
	if err := tx.
		Find(&dir).Error; err != nil {
		return nil, err
	}
	return dir, nil
}

func (dr *directoryRepo) ListByPathPrefix(path string) ([]entity.Directory, error) {
	dir := []entity.Directory{}
	if err := dr.db.
		Where("path_prefix = ?", path).
		Find(&dir).Error; err != nil {
		return nil, err
	}
	return dir, nil
}

func (dr *directoryRepo) FindById(id uint64) (*entity.Directory, error) {
	dir := entity.Directory{}
	if err := dr.db.
		Where("id = ?", id).
		Take(&dir).Error; err != nil {
		return nil, err
	}
	return &dir, nil
}

func (dr *directoryRepo) FindByFullPath(prefix string, name string) (*entity.Directory, error) {
	dir := entity.Directory{}
	if err := dr.db.
		Where("path_prefix = ?", prefix).
		Where("name = ?", name).
		Take(&dir).Error; err != nil {
		return nil, err
	}
	return &dir, nil
}

func (dr *directoryRepo) Create(dir *entity.Directory) error {
	err := dr.db.Create(dir).Error
	return err
}

func (dr *directoryRepo) Update(id uint64, dir *entity.Directory) error {
	err := dr.db.Model(entity.Directory{Id: id}).Updates(dir).Error
	return err
}

func (dr *directoryRepo) Delete(id uint64) error {
	err := dr.db.Delete(entity.Directory{Id: id}).Error
	return err
}
