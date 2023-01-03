package repository

import "gorm.io/gorm"

type RepoManager struct {
	repos map[string]Repository
}

func NewRepoManager(db *gorm.DB) RepoManager {
	repos := map[string]Repository{
		"user":         NewUserRepo(db),
		"login_device": NewLoginDeviceRepo(db),
		"web3_wallet":  NewWeb3WalletRepo(db),
		"verify_sms":   NewVerifySmsRepo(db),
	}
	return RepoManager{repos: repos}
}

// for injecting mock repo while testing
func (rm *RepoManager) ReplaceRepos(repos map[string]Repository) {
	rm.repos = repos
}

func GetRepo[T Repository](rm *RepoManager, table string) T {
	return rm.repos[table].(T)
}
