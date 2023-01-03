package service

import (
	"4dmetaverse/storage_service/internal/entity"
	"4dmetaverse/storage_service/internal/repository"
	"4dmetaverse/storage_service/internal/utility"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"os"
	"strings"

	"github.com/dranikpg/dto-mapper"
)

type FileCreateDTO struct {
	SupplementData map[string]interface{} `json:"supplementData"`
	StorePath      string                 `json:"storePath"`
	DirectoryId    uint64                 `json:"directoryId"`
	Permission     int8                   `json:"permission"`
	CreateBy       string                 `json:"createBy"`
}

type FileUpdateDTO struct {
	SupplementData map[string]interface{} `json:"supplementData"`
	Permission     int8                   `json:"permission"`
	UpdateBy       string                 `json:"updateBy"`
}

type FileSwapDTO struct {
	File     *multipart.FileHeader
	UpdateBy string
}

type FileSaveDTO struct {
	File           *multipart.FileHeader
	StorePath      string
	SupplementData map[string]interface{}
	DirectoryId    uint64
	CreateBy       string
}

//go:generate mockgen -destination=../../test/mocks/mock_file_service.go -package=mocks . FileService
type FileService interface {
	Service
	GetEntitiesByDirId(dirId uint64) ([]entity.File, error)
	GetEntitiesByPathPrefix(path string) ([]entity.File, error)
	GetEntityByPath(path string) (*entity.File, error)
	GetEntity(id string) (*entity.File, error)
	CreateEntity(fileDto FileCreateDTO) (*entity.File, error)
	Save(saveDto FileSaveDTO) (*entity.File, error)
	Swap(id string, swapDto FileSwapDTO) (*entity.File, error)
	UpdateEntity(id string, fileDto FileUpdateDTO) (*entity.File, error)
	DeleteEntityByPath(path string) error
	DeleteEntityByDirId(dirId uint64) error
	DeleteEntity(id string) error
}

type fileService struct {
	fileRepo    repository.FileRepo
	sm          *ServiceManager
	idGenerator utility.IdGenerator
	timer       utility.Timer
}

func NewFileService(fileRepo repository.FileRepo, sm *ServiceManager, idGenerator utility.IdGenerator, timer utility.Timer) FileService {
	return &fileService{
		fileRepo:    fileRepo,
		sm:          sm,
		idGenerator: idGenerator,
		timer:       timer,
	}
}

func (fs *fileService) GetEntitiesBySQL(sql string) any {
	files := fs.fileRepo.FindByNativeSQL(sql).([]entity.File)
	for i := range files {
		fs.loadTransitColumn(&files[i])
	}
	return files
}

func (fs *fileService) GetEntitiesByDirId(dirId uint64) ([]entity.File, error) {
	files, err := fs.fileRepo.ListByDirId(dirId)
	if err != nil {
		return nil, err
	}
	for i := range files {
		fs.loadTransitColumn(&files[i])
	}
	return files, nil
}

func (fs *fileService) GetEntitiesByPathPrefix(path string) ([]entity.File, error) {
	dir, err := GetService[DirectoryService](fs.sm, "directory").GetEntityByPath(path)
	if err != nil {
		return []entity.File{}, err
	}

	files, err := fs.fileRepo.ListByDirId(dir.Id)
	if err != nil {
		return nil, err
	}
	for i := range files {
		fs.loadTransitColumn(&files[i])
	}
	return files, nil
}

func (fs *fileService) GetEntityByPath(path string) (*entity.File, error) {
	pathSplit := strings.Split(path, "/")
	file, err := fs.fileRepo.FindByPath(
		strings.Join(pathSplit[:len(pathSplit)-1], "/"),
		pathSplit[len(pathSplit)-1],
	)
	if err != nil {
		return nil, err
	}
	return fs.loadTransitColumn(file), nil
}

func (fs *fileService) GetEntity(id string) (*entity.File, error) {
	file, err := fs.fileRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	return fs.loadTransitColumn(file), nil
}

func (fs *fileService) CreateEntity(fileDto FileCreateDTO) (*entity.File, error) {
	file := entity.File{}
	dto.Map(&file, fileDto)
	file.Id = fs.idGenerator.NanoId32()
	if err := fs.fileRepo.Create(&file); err != nil {
		return nil, err
	}
	return fs.loadTransitColumn(&file), nil
}

func (fs *fileService) Save(saveDto FileSaveDTO) (*entity.File, error) {
	id := fs.idGenerator.NanoId32()
	fileNameSplit := strings.Split(saveDto.File.Filename, ".")
	name := strings.Join(fileNameSplit[:len(fileNameSplit)-1], ".")
	extension := fileNameSplit[len(fileNameSplit)-1]
	storeDir := fs.getStoreDir()
	storeFileName := fmt.Sprintf("%s.%s", id, extension)
	publicUrlValue := url.QueryEscape(saveDto.StorePath + "/" + saveDto.File.Filename)
	hash, err := fs.saveFile(saveDto.File, storeDir, storeFileName)
	if err != nil {
		return nil, err
	}
	file := entity.File{
		Id:             id,
		Name:           name,
		Extension:      extension,
		MimeType:       saveDto.File.Header.Get("Content-Type"),
		StoreLocation:  storeDir + storeFileName,
		SupplementData: saveDto.SupplementData,
		Size:           uint64(saveDto.File.Size),
		DirectoryId:    saveDto.DirectoryId,
		Sha:            hash,
		PublicUrl:      fmt.Sprintf("%s/file/%s", os.Getenv("PUBLIC_URL"), publicUrlValue),
		CreateBy:       saveDto.CreateBy,
	}
	if err := fs.fileRepo.Create(&file); err != nil {
		return nil, err
	}
	return fs.loadTransitColumn(&file), nil
}

func (fs *fileService) Swap(id string, swapDto FileSwapDTO) (*entity.File, error) {
	f, err := fs.fileRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	f = fs.loadTransitColumn(f)
	fileNameSplit := strings.Split(swapDto.File.Filename, ".")
	name := strings.Join(fileNameSplit[:len(fileNameSplit)-1], ".")
	extension := fileNameSplit[len(fileNameSplit)-1]
	storeDir := fs.getStoreDir()
	storeFileName := fmt.Sprintf("%s.%s", id, extension)
	publicUrlValue := url.QueryEscape(f.PathPrefix + "/" + swapDto.File.Filename)
	hash, err := fs.saveFile(swapDto.File, storeDir, storeFileName)
	if err != nil {
		return nil, err
	}
	file := entity.File{
		Name:          name,
		Extension:     extension,
		MimeType:      swapDto.File.Header.Get("Content-Type"),
		StoreLocation: storeDir + storeFileName,
		Size:          uint64(swapDto.File.Size),
		Sha:           hash,
		PublicUrl:     fmt.Sprintf("%s/file/%s", os.Getenv("PUBLIC_URL"), publicUrlValue),
		UpdateBy:      swapDto.UpdateBy,
	}
	if err := fs.fileRepo.Update(id, &file); err != nil {
		return nil, err
	}
	f, _ = fs.fileRepo.FindById(id)
	return fs.loadTransitColumn(f), nil
}

func (fs *fileService) UpdateEntity(id string, fileDto FileUpdateDTO) (*entity.File, error) {
	file := entity.File{}
	dto.Map(&file, fileDto)
	if err := fs.fileRepo.Update(id, &file); err != nil {
		return nil, err
	}
	f, _ := fs.fileRepo.FindById(id)
	return fs.loadTransitColumn(f), nil
}

func (fs *fileService) DeleteEntityByPath(path string) error {
	file, err := fs.GetEntityByPath(path)
	if err != nil {
		return err
	}

	if err := os.Remove(file.StoreLocation); err != nil {
		return err
	}

	return fs.fileRepo.Delete(file.Id)
}

func (fs *fileService) DeleteEntityByDirId(dirId uint64) error {
	files, err := fs.fileRepo.ListByDirId(dirId)
	if err != nil {
		return err
	}

	for _, f := range files {
		os.Remove(f.StoreLocation)
		fs.fileRepo.Delete(f.Id)
	}

	return nil
}

func (fs *fileService) DeleteEntity(id string) error {
	file, err := fs.GetEntity(id)
	if err != nil {
		return err
	}

	if err := os.Remove(file.StoreLocation); err != nil {
		return err
	}

	return fs.fileRepo.Delete(file.Id)
}

func (fs *fileService) loadTransitColumn(file *entity.File) *entity.File {
	dir, err := GetService[DirectoryService](fs.sm, "directory").GetEntity(file.DirectoryId)
	if err != nil {
		return file
	}
	file.PathPrefix = fmt.Sprintf("%s/%s", dir.PathPrefix, dir.Name)
	return file
}

func (fs *fileService) getStoreDir() string {
	now := fs.timer.Now()
	baseDir := os.Getenv("STORAGE_DIR")
	return fmt.Sprintf("%s/%s/", baseDir, now.Format("2006-01-02"))
}

func (fs *fileService) saveFile(file *multipart.FileHeader, path string, fileName string) (string, error) {
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	err = os.MkdirAll(path, os.FileMode(0666))
	if err != nil {
		return "", err
	}

	out, err := os.Create(path + fileName)
	if err != nil {
		return "", err
	}
	defer out.Close()

	h := sha512.New()
	mw := io.MultiWriter(h, out)
	if _, err := io.Copy(mw, src); err != nil {
		return "", err
	}

	return hex.EncodeToString(h.Sum(nil)), err
}
