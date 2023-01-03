package service

import "4dmetaverse/user_db/internal/repository"

type ServiceManager struct {
	services map[string]Service
}

func NewServiceManager(rm *repository.RepoManager) ServiceManager {
	services := map[string]Service{
		"user":         NewUserService(repository.GetRepo[repository.UserRepo](rm, "user")),
		"login_device": NewLoginDeviceService(repository.GetRepo[repository.LoginDeviceRepo](rm, "login_device")),
		"web3_wallet":  NewWeb3WalletService(repository.GetRepo[repository.Web3WalletRepo](rm, "web3_wallet")),
		"verify_sms":   NewVerifySmsService(repository.GetRepo[repository.VerifySmsRepo](rm, "verify_sms")),
	}
	return ServiceManager{services: services}
}

// for injecting mock service while testing
func (sm *ServiceManager) ReplaceService(services map[string]Service) {
	sm.services = services
}

func GetService[T Service](sm *ServiceManager, table string) T {
	return sm.services[table].(T)
}
