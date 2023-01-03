package service

import (
	"4dmetaverse/storage_service/internal/repository"
	"4dmetaverse/storage_service/internal/utility"
)

type ServiceManager struct {
	services map[string]Service
}

func NewServiceManager(rm *repository.RepoManager) *ServiceManager {
	sm := &ServiceManager{services: map[string]Service{
		"access_record": NewAccessRecordService(repository.GetRepo[repository.AccessRecordRepo](rm, "access_record")),
	}}
	dirService := NewDirectoryService(repository.GetRepo[repository.DirectoryRepo](rm, "directory"), sm)
	fileService := NewFileService(
		repository.GetRepo[repository.FileRepo](rm, "file"),
		sm,
		&utility.DefaultIdGenerator{},
		&utility.DefaultTimer{},
	)
	sm.addService("file", fileService)
	sm.addService("directory", dirService)
	return sm
}

func (sm *ServiceManager) addService(name string, service Service) {
	sm.services[name] = service
}

// for injecting mock service while testing
func (sm *ServiceManager) ReplaceService(services map[string]Service) {
	sm.services = services
}

func GetService[T Service](sm *ServiceManager, table string) T {
	return sm.services[table].(T)
}
