package service

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/repository"

	"github.com/dranikpg/dto-mapper"
)

type Web3WalletCreateDTO struct {
	UserId  string `json:"userId"`
	Type    string `json:"type"`
	Address string `json:"address"`
	Nonce   string `json:"nonce"`
}

//go:generate mockgen -destination=../../test/mocks/mock_web3_wallet_service.go -package=mocks . Web3WalletService
type Web3WalletService interface {
	Service
	CreateEntity(walletDto Web3WalletCreateDTO) (*entity.Web3Wallet, error)
	GetEntityByAddress(address string) (*entity.Web3Wallet, error)
}

type web3WalletService struct {
	web3WalletRepo repository.Web3WalletRepo
}

func NewWeb3WalletService(web3WalletRepo repository.Web3WalletRepo) Web3WalletService {
	return &web3WalletService{
		web3WalletRepo: web3WalletRepo,
	}
}

func (wws *web3WalletService) GetEntitiesBySQL(sql string) any {
	return wws.web3WalletRepo.FindByNativeSQL(sql)
}

func (wws *web3WalletService) CreateEntity(walletDto Web3WalletCreateDTO) (*entity.Web3Wallet, error) {
	wallet := entity.Web3Wallet{}
	dto.Map(&wallet, walletDto)
	if err := wws.web3WalletRepo.Create(&wallet); err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (wws *web3WalletService) GetEntityByAddress(address string) (*entity.Web3Wallet, error) {
	wallet, err := wws.web3WalletRepo.FindByAddress(address)
	if err != nil {
		return nil, err
	}
	return wallet, nil
}
