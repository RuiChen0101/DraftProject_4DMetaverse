// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/service (interfaces: ShopService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	service "4dmetaverse/main_db/internal/service"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockShopService is a mock of ShopService interface.
type MockShopService struct {
	ctrl     *gomock.Controller
	recorder *MockShopServiceMockRecorder
}

// MockShopServiceMockRecorder is the mock recorder for MockShopService.
type MockShopServiceMockRecorder struct {
	mock *MockShopService
}

// NewMockShopService creates a new mock instance.
func NewMockShopService(ctrl *gomock.Controller) *MockShopService {
	mock := &MockShopService{ctrl: ctrl}
	mock.recorder = &MockShopServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockShopService) EXPECT() *MockShopServiceMockRecorder {
	return m.recorder
}

// CreateEntity mocks base method.
func (m *MockShopService) CreateEntity(arg0 service.ShopCreateDTO) (*entity.Shop, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntity", arg0)
	ret0, _ := ret[0].(*entity.Shop)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntity indicates an expected call of CreateEntity.
func (mr *MockShopServiceMockRecorder) CreateEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntity", reflect.TypeOf((*MockShopService)(nil).CreateEntity), arg0)
}

// DeleteEntity mocks base method.
func (m *MockShopService) DeleteEntity(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntity", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntity indicates an expected call of DeleteEntity.
func (mr *MockShopServiceMockRecorder) DeleteEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntity", reflect.TypeOf((*MockShopService)(nil).DeleteEntity), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockShopService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockShopServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockShopService)(nil).GetEntitiesBySQL), arg0)
}

// GetEntity mocks base method.
func (m *MockShopService) GetEntity(arg0 uuid.UUID) (*entity.Shop, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntity", arg0)
	ret0, _ := ret[0].(*entity.Shop)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntity indicates an expected call of GetEntity.
func (mr *MockShopServiceMockRecorder) GetEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntity", reflect.TypeOf((*MockShopService)(nil).GetEntity), arg0)
}

// UpdateEntity mocks base method.
func (m *MockShopService) UpdateEntity(arg0 uuid.UUID, arg1 service.ShopUpdateDTO) (*entity.Shop, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateEntity", arg0, arg1)
	ret0, _ := ret[0].(*entity.Shop)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateEntity indicates an expected call of UpdateEntity.
func (mr *MockShopServiceMockRecorder) UpdateEntity(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateEntity", reflect.TypeOf((*MockShopService)(nil).UpdateEntity), arg0, arg1)
}