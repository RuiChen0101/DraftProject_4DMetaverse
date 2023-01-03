// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/user_db/internal/repository (interfaces: Web3WalletRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/user_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockWeb3WalletRepo is a mock of Web3WalletRepo interface.
type MockWeb3WalletRepo struct {
	ctrl     *gomock.Controller
	recorder *MockWeb3WalletRepoMockRecorder
}

// MockWeb3WalletRepoMockRecorder is the mock recorder for MockWeb3WalletRepo.
type MockWeb3WalletRepoMockRecorder struct {
	mock *MockWeb3WalletRepo
}

// NewMockWeb3WalletRepo creates a new mock instance.
func NewMockWeb3WalletRepo(ctrl *gomock.Controller) *MockWeb3WalletRepo {
	mock := &MockWeb3WalletRepo{ctrl: ctrl}
	mock.recorder = &MockWeb3WalletRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockWeb3WalletRepo) EXPECT() *MockWeb3WalletRepoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockWeb3WalletRepo) Create(arg0 *entity.Web3Wallet) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockWeb3WalletRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockWeb3WalletRepo)(nil).Create), arg0)
}

// FindByAddress mocks base method.
func (m *MockWeb3WalletRepo) FindByAddress(arg0 string) (*entity.Web3Wallet, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByAddress", arg0)
	ret0, _ := ret[0].(*entity.Web3Wallet)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindByAddress indicates an expected call of FindByAddress.
func (mr *MockWeb3WalletRepoMockRecorder) FindByAddress(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByAddress", reflect.TypeOf((*MockWeb3WalletRepo)(nil).FindByAddress), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockWeb3WalletRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockWeb3WalletRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockWeb3WalletRepo)(nil).FindByNativeSQL), arg0)
}