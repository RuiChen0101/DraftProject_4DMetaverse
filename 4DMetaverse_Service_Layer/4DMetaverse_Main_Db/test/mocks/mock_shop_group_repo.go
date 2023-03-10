// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/repository (interfaces: ShopGroupRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockShopGroupRepo is a mock of ShopGroupRepo interface.
type MockShopGroupRepo struct {
	ctrl     *gomock.Controller
	recorder *MockShopGroupRepoMockRecorder
}

// MockShopGroupRepoMockRecorder is the mock recorder for MockShopGroupRepo.
type MockShopGroupRepoMockRecorder struct {
	mock *MockShopGroupRepo
}

// NewMockShopGroupRepo creates a new mock instance.
func NewMockShopGroupRepo(ctrl *gomock.Controller) *MockShopGroupRepo {
	mock := &MockShopGroupRepo{ctrl: ctrl}
	mock.recorder = &MockShopGroupRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockShopGroupRepo) EXPECT() *MockShopGroupRepoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockShopGroupRepo) Create(arg0 *entity.ShopGroup) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockShopGroupRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockShopGroupRepo)(nil).Create), arg0)
}

// Delete mocks base method.
func (m *MockShopGroupRepo) Delete(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Delete", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Delete indicates an expected call of Delete.
func (mr *MockShopGroupRepoMockRecorder) Delete(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Delete", reflect.TypeOf((*MockShopGroupRepo)(nil).Delete), arg0)
}

// FindById mocks base method.
func (m *MockShopGroupRepo) FindById(arg0 uuid.UUID) (*entity.ShopGroup, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindById", arg0)
	ret0, _ := ret[0].(*entity.ShopGroup)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindById indicates an expected call of FindById.
func (mr *MockShopGroupRepoMockRecorder) FindById(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindById", reflect.TypeOf((*MockShopGroupRepo)(nil).FindById), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockShopGroupRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockShopGroupRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockShopGroupRepo)(nil).FindByNativeSQL), arg0)
}

// Update mocks base method.
func (m *MockShopGroupRepo) Update(arg0 uuid.UUID, arg1 *entity.ShopGroup) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Update", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// Update indicates an expected call of Update.
func (mr *MockShopGroupRepoMockRecorder) Update(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Update", reflect.TypeOf((*MockShopGroupRepo)(nil).Update), arg0, arg1)
}
