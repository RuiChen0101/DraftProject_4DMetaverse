package service

import "4dmetaverse/main_db/internal/repository"

type ServiceManager struct {
	services map[string]Service
}

func NewServiceManager(rm *repository.RepoManager) *ServiceManager {
	collectionService := NewCollectionService(repository.GetRepo[repository.CollectionRepo](rm, "collection"))
	shopImageService := NewShopImageService(repository.GetRepo[repository.ShopImageRepo](rm, "shop_image"))
	salePlanService := NewSalePlanService(repository.GetRepo[repository.SalePlanRepo](rm, "sale_plan"), collectionService)
	return &ServiceManager{services: map[string]Service{
		"shop_group":          NewShopGroupService(repository.GetRepo[repository.ShopGroupRepo](rm, "shop_group")),
		"shop":                NewShopService(repository.GetRepo[repository.ShopRepo](rm, "shop"), shopImageService, salePlanService),
		"shop_image":          shopImageService,
		"sale_plan":           salePlanService,
		"purchase_record":     NewPurchaseRecordService(repository.GetRepo[repository.PurchaseRecordRepo](rm, "purchase_record")),
		"collection":          collectionService,
		"collection_pool":     NewCollectionPoolService(repository.GetRepo[repository.CollectionPoolRepo](rm, "collection_pool")),
		"unlocked_collection": NewUnlockedCollectionService(repository.GetRepo[repository.UnlockedCollectionRepo](rm, "unlocked_collection")),
	}}
}

func (sm *ServiceManager) AddService(name string, service Service) {
	sm.services[name] = service
}

// for injecting mock service while testing
func (sm *ServiceManager) ReplaceService(services map[string]Service) {
	sm.services = services
}

func GetService[T Service](sm *ServiceManager, table string) T {
	return sm.services[table].(T)
}
