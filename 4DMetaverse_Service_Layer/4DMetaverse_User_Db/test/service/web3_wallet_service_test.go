package service_test

import (
	"4dmetaverse/user_db/internal/entity"
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/test/mocks"
	"errors"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type Web3WalletServiceTestSuite struct {
	suite.Suite
	web3WalletRepo    *mocks.MockWeb3WalletRepo
	web3WalletService service.Web3WalletService
}

func (wst *Web3WalletServiceTestSuite) SetupSuite() {
	ctrl := gomock.NewController(wst.T())
	defer ctrl.Finish()

	wst.web3WalletRepo = mocks.NewMockWeb3WalletRepo(ctrl)
	wst.web3WalletService = service.NewWeb3WalletService(wst.web3WalletRepo)
}

func (wst *Web3WalletServiceTestSuite) TestCreateEntity() {
	wst.web3WalletRepo.EXPECT().Create(&entity.Web3Wallet{
		UserId:  "1234-5678-90ab-cdef",
		Type:    "metamask",
		Address: "0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55",
		Nonce:   "1234567890abcdef",
	}).Return(nil)

	wallet, err := wst.web3WalletService.CreateEntity(service.Web3WalletCreateDTO{
		UserId:  "1234-5678-90ab-cdef",
		Type:    "metamask",
		Address: "0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55",
		Nonce:   "1234567890abcdef",
	})

	wst.Nil(err)
	wst.EqualValues(&entity.Web3Wallet{
		UserId:  "1234-5678-90ab-cdef",
		Type:    "metamask",
		Address: "0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55",
		Nonce:   "1234567890abcdef",
	}, wallet)
}

func (wst *Web3WalletServiceTestSuite) TestCreateEntityError() {
	wst.web3WalletRepo.EXPECT().Create(gomock.Any()).Return(errors.New("fail"))

	wallet, err := wst.web3WalletService.CreateEntity(service.Web3WalletCreateDTO{
		UserId:  "1234-5678-90ab-cdef",
		Type:    "metamask",
		Address: "0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55",
		Nonce:   "1234567890abcdef",
	})

	wst.Nil(wallet)
	wst.NotNil(err)
}

func (wst *Web3WalletServiceTestSuite) TestGetEntityByAddress() {
	wst.web3WalletRepo.EXPECT().FindByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55").Return(&entity.Web3Wallet{
		Id:     0,
		UserId: "1234-5678-90ab-cdef",
	}, nil)

	wallet, err := wst.web3WalletService.GetEntityByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55")
	wst.EqualValues(&entity.Web3Wallet{
		Id:     0,
		UserId: "1234-5678-90ab-cdef",
	}, wallet)
	wst.Nil(err)
}

func (wst *Web3WalletServiceTestSuite) TestGetEntityByAddressError() {
	wst.web3WalletRepo.EXPECT().FindByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55").Return(nil, errors.New("fail"))

	wallet, err := wst.web3WalletService.GetEntityByAddress("0x95Ce53D9d4D7CbA60e4CFf7FF8aFc04426310E55")
	wst.Nil(wallet)
	wst.NotNil(err)
}

func TestWeb3WalletService(t *testing.T) {
	suite.Run(t, new(Web3WalletServiceTestSuite))
}
