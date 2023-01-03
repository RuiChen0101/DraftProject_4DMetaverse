package repository

import (
	"4dmetaverse/user_db/internal/entity"

	"gorm.io/gorm"
)

//go:generate mockgen -destination=../../test/mocks/mock_web3_wallet_repo.go -package=mocks . Web3WalletRepo
type Web3WalletRepo interface {
	Repository
	FindByAddress(address string) (*entity.Web3Wallet, error)
	Create(wallet *entity.Web3Wallet) error
}

type web3WalletRepo struct {
	db *gorm.DB
}

func NewWeb3WalletRepo(db *gorm.DB) Web3WalletRepo {
	db.AutoMigrate(&entity.Web3Wallet{})
	return &web3WalletRepo{
		db: db,
	}
}

func (wwr *web3WalletRepo) FindByNativeSQL(sql string) any {
	result := []entity.Web3Wallet{}
	wwr.db.Raw(sql).Scan(&result)
	return result
}

func (wwr *web3WalletRepo) FindByAddress(address string) (*entity.Web3Wallet, error) {
	wallet := entity.Web3Wallet{}
	if err := wwr.db.
		Where("address = ?", address).
		Take(&wallet).Error; err != nil {
		return nil, err
	}
	return &wallet, nil
}

func (wwr *web3WalletRepo) Create(wallet *entity.Web3Wallet) error {
	err := wwr.db.Create(wallet).Error
	return err
}
