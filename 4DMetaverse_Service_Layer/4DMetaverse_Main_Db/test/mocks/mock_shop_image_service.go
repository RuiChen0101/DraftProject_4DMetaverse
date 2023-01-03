// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/service (interfaces: ShopImageService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	service "4dmetaverse/main_db/internal/service"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockShopImageService is a mock of ShopImageService interface.
type MockShopImageService struct {
	ctrl     *gomock.Controller
	recorder *MockShopImageServiceMockRecorder
}

// MockShopImageServiceMockRecorder is the mock recorder for MockShopImageService.
type MockShopImageServiceMockRecorder struct {
	mock *MockShopImageService
}

// NewMockShopImageService creates a new mock instance.
func NewMockShopImageService(ctrl *gomock.Controller) *MockShopImageService {
	mock := &MockShopImageService{ctrl: ctrl}
	mock.recorder = &MockShopImageServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockShopImageService) EXPECT() *MockShopImageServiceMockRecorder {
	return m.recorder
}

// CreateEntity mocks base method.
func (m *MockShopImageService) CreateEntity(arg0 service.ShopImageCreateDTO) (*entity.ShopImage, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntity", arg0)
	ret0, _ := ret[0].(*entity.ShopImage)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntity indicates an expected call of CreateEntity.
func (mr *MockShopImageServiceMockRecorder) CreateEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntity", reflect.TypeOf((*MockShopImageService)(nil).CreateEntity), arg0)
}

// DeleteEntity mocks base method.
func (m *MockShopImageService) DeleteEntity(arg0 uint64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntity", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntity indicates an expected call of DeleteEntity.
func (mr *MockShopImageServiceMockRecorder) DeleteEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntity", reflect.TypeOf((*MockShopImageService)(nil).DeleteEntity), arg0)
}

// GetCoverImage mocks base method.
func (m *MockShopImageService) GetCoverImage(arg0 uuid.UUID) (*entity.ShopImage, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetCoverImage", arg0)
	ret0, _ := ret[0].(*entity.ShopImage)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetCoverImage indicates an expected call of GetCoverImage.
func (mr *MockShopImageServiceMockRecorder) GetCoverImage(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetCoverImage", reflect.TypeOf((*MockShopImageService)(nil).GetCoverImage), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockShopImageService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockShopImageServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockShopImageService)(nil).GetEntitiesBySQL), arg0)
}

// SwitchCover mocks base method.
func (m *MockShopImageService) SwitchCover(arg0 uint64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SwitchCover", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// SwitchCover indicates an expected call of SwitchCover.
func (mr *MockShopImageServiceMockRecorder) SwitchCover(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SwitchCover", reflect.TypeOf((*MockShopImageService)(nil).SwitchCover), arg0)
}
