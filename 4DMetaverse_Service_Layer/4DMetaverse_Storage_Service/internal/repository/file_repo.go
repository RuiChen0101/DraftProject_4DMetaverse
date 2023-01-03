package repository

import (
	"4dmetaverse/storage_service/internal/entity"
	"strings"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_file_repo.go -package=mocks . FileRepo
type FileRepo interface {
	Repository
	ListByDirId(dirId uint64) ([]entity.File, error)
	FindById(id string) (*entity.File, error)
	FindByPath(prefix string, fileName string) (*entity.File, error)
	Create(file *entity.File) error
	Update(id string, file *entity.File) error
	Delete(id string) error
}

type fileRepo struct {
	db *gorm.DB
}

func NewFileRepo(db *gorm.DB) FileRepo {
	db.AutoMigrate(&entity.File{})
	return &fileRepo{
		db: db,
	}
}

func (fr *fileRepo) FindByNativeSQL(sql string) any {
	result := []entity.File{}
	fr.db.Raw(sql).Scan(&result)
	return result
}

func (fr *fileRepo) ListByDirId(dirId uint64) ([]entity.File, error) {
	files := []entity.File{}
	if err := fr.db.
		Where("directory_id = ?", dirId).
		Find(&files).Error; err != nil {
		return nil, err
	}
	return files, nil
}

func (fr *fileRepo) FindById(id string) (*entity.File, error) {
	file := entity.File{}
	if err := fr.db.
		Where("id = ?", id).
		Take(&file).Error; err != nil {
		return nil, err
	}
	return &file, nil
}

func (fr *fileRepo) FindByPath(prefix string, fileName string) (*entity.File, error) {
	fileNameSplit := strings.Split(fileName, ".")
	prefixSplit := strings.Split(prefix, "/")
	file := entity.File{}
	if err := fr.db.Raw(
		"SELECT file.* FROM file,directory WHERE file.directory_id=directory.id AND file.name=? AND file.extension=? AND directory.name=? AND directory.path_prefix=?",
		strings.Join(fileNameSplit[:len(fileNameSplit)-1], "."),
		fileNameSplit[len(fileNameSplit)-1],
		prefixSplit[len(prefixSplit)-1],
		strings.Join(prefixSplit[:len(prefixSplit)-1], "/"),
	).Take(&file).Error; err != nil {
		return nil, err
	}
	return &file, nil
}

func (fr *fileRepo) Create(file *entity.File) error {
	err := fr.db.Create(file).Error
	return err
}

func (fr *fileRepo) Update(id string, file *entity.File) error {
	err := fr.db.Model(entity.File{Id: id}).Updates(file).Error
	return err
}

func (fr *fileRepo) Delete(id string) error {
	return fr.db.Delete(entity.File{Id: id}).Error
}
