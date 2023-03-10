// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/repository (interfaces: ShopRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockShopRepo is a mock of ShopRepo interface.
type MockShopRepo struct {
	ctrl     *gomock.Controller
	recorder *MockShopRepoMockRecorder
}

// MockShopRepoMockRecorder is the mock recorder for MockShopRepo.
type MockShopRepoMockRecorder struct {
	mock *MockShopRepo
}

// NewMockShopRepo creates a new mock instance.
func NewMockShopRepo(ctrl *gomock.Controller) *MockShopRepo {
	mock := &MockShopRepo{ctrl: ctrl}
	mock.recorder = &MockShopRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockShopRepo) EXPECT() *MockShopRepoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockShopRepo) Create(arg0 *entity.Shop) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockShopRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockShopRepo)(nil).Create), arg0)
}

// Delete mocks base method.
func (m *MockShopRepo) Delete(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Delete", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Delete indicates an expected call of Delete.
func (mr *MockShopRepoMockRecorder) Delete(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Delete", reflect.TypeOf((*MockShopRepo)(nil).Delete), arg0)
}

// FindById mocks base method.
func (m *MockShopRepo) FindById(arg0 uuid.UUID) (*entity.Shop, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindById", arg0)
	ret0, _ := ret[0].(*entity.Shop)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindById indicates an expected call of FindById.
func (mr *MockShopRepoMockRecorder) FindById(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindById", reflect.TypeOf((*MockShopRepo)(nil).FindById), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockShopRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockShopRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockShopRepo)(nil).FindByNativeSQL), arg0)
}

// Update mocks base method.
func (m *MockShopRepo) Update(arg0 uuid.UUID, arg1 *entity.Shop) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Update", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// Update indicates an expected call of Update.
func (mr *MockShopRepoMockRecorder) Update(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Update", reflect.TypeOf((*MockShopRepo)(nil).Update), arg0, arg1)
}
