package service

import (
	"4dmetaverse/storage_service/internal/entity"
	"4dmetaverse/storage_service/internal/repository"
	"strings"

	"github.com/dranikpg/dto-mapper"
)

type DirectoryEnsurePathDTO struct {
	Path string `json:"path"`
}

type DirectoryUpdateDTO struct {
	IsLocked bool `json:"isLocked"`
}

//go:generate mockgen -destination=../../test/mocks/mock_directory_service.go -package=mocks . DirectoryService
type DirectoryService interface {
	GetEntitiesBySQL(sql string) any
	GetEntitiesByParentId(parentId *uint64) ([]entity.Directory, error)
	GetEntitiesByPathPrefix(path string) ([]entity.Directory, error)
	GetEntity(id uint64) (*entity.Directory, error)
	GetEntityByPath(path string) (*entity.Directory, error)
	EnsurePath(path string) (uint64, error)
	UpdateEntity(id uint64, dirDto DirectoryUpdateDTO) (*entity.Directory, error)
	DeleteEntity(id uint64) error
}

type directoryService struct {
	directoryRepo repository.DirectoryRepo
	sm            *ServiceManager
}

func NewDirectoryService(directoryRepo repository.DirectoryRepo, sm *ServiceManager) DirectoryService {
	return &directoryService{
		directoryRepo: directoryRepo,
		sm:            sm,
	}
}

func (ds *directoryService) GetEntitiesBySQL(sql string) any {
	return ds.directoryRepo.FindByNativeSQL(sql)
}

func (ds *directoryService) GetEntitiesByParentId(parentId *uint64) ([]entity.Directory, error) {
	return ds.directoryRepo.ListByParentId(parentId)
}

func (ds *directoryService) GetEntitiesByPathPrefix(path string) ([]entity.Directory, error) {
	return ds.directoryRepo.ListByPathPrefix(path)
}

func (ds *directoryService) GetEntity(id uint64) (*entity.Directory, error) {
	dir, err := ds.directoryRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return dir, nil
}

func (fs *directoryService) GetEntityByPath(path string) (*entity.Directory, error) {
	pathSplit := strings.Split(path, "/")
	return fs.directoryRepo.FindByFullPath(
		strings.Join(pathSplit[:len(pathSplit)-1], "/"),
		pathSplit[len(pathSplit)-1],
	)
}

func (ds *directoryService) EnsurePath(path string) (uint64, error) {
	if path == "" {
		return 0, nil
	}
	pathList := strings.Split(path, "/")
	name := pathList[len(pathList)-1]
	prefix := strings.Join(pathList[:len(pathList)-1], "/")
	dir, err := ds.directoryRepo.FindByFullPath(prefix, name)
	if err == nil {
		return dir.Id, nil
	}
	parentId, _ := ds.EnsurePath(prefix)
	createDir := entity.Directory{
		Name:       name,
		PathPrefix: prefix,
	}
	if parentId != 0 {
		createDir.ParentDirId = &parentId
	}
	ds.directoryRepo.Create(&createDir)
	return createDir.Id, nil
}

func (ds *directoryService) UpdateEntity(id uint64, dirDto DirectoryUpdateDTO) (*entity.Directory, error) {
	dir := entity.Directory{}
	dto.Map(&dir, dirDto)
	if err := ds.directoryRepo.Update(id, &dir); err != nil {
		return nil, err
	}
	d, _ := ds.directoryRepo.FindById(id)
	return d, nil
}

func (ds *directoryService) DeleteEntity(id uint64) error {
	childDirs, err := ds.directoryRepo.ListByParentId(&id)
	if err != nil {
		childDirs = []entity.Directory{}
	}

	for _, d := range childDirs {
		ds.DeleteEntity(d.Id)
	}

	GetService[FileService](ds.sm, "file").DeleteEntityByDirId(id)
	ds.directoryRepo.Delete(id)
	return nil
}
