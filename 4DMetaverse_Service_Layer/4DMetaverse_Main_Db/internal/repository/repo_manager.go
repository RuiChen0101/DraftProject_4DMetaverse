package repository

import "gorm.io/gorm"

type RepoManager struct {
	repos map[string]Repository
}

func NewRepoManager(db *gorm.DB) *RepoManager {
	repos := map[string]Repository{
		"shop_group":          NewShopGroupRepo(db),
		"shop":                NewShopRepo(db),
		"shop_image":          NewShopImageRepo(db),
		"sale_plan":           NewSalePlanRepo(db),
		"purchase_record":     NewPurchaseRecordRepo(db),
		"collection_pool":     NewCollectionPoolRepo(db),
		"collection":          NewCollectionRepo(db),
		"unlocked_collection": NewUnlockedCollectionRepo(db),
	}
	return &RepoManager{repos: repos}
}

// for injecting mock repo while testing
func (rm *RepoManager) ReplaceRepos(repos map[string]Repository) {
	rm.repos = repos
}

func GetRepo[T Repository](rm *RepoManager, table string) T {
	return rm.repos[table].(T)
}
