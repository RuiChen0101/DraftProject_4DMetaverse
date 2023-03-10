// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/service (interfaces: CollectionPoolService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	service "4dmetaverse/main_db/internal/service"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockCollectionPoolService is a mock of CollectionPoolService interface.
type MockCollectionPoolService struct {
	ctrl     *gomock.Controller
	recorder *MockCollectionPoolServiceMockRecorder
}

// MockCollectionPoolServiceMockRecorder is the mock recorder for MockCollectionPoolService.
type MockCollectionPoolServiceMockRecorder struct {
	mock *MockCollectionPoolService
}

// NewMockCollectionPoolService creates a new mock instance.
func NewMockCollectionPoolService(ctrl *gomock.Controller) *MockCollectionPoolService {
	mock := &MockCollectionPoolService{ctrl: ctrl}
	mock.recorder = &MockCollectionPoolServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockCollectionPoolService) EXPECT() *MockCollectionPoolServiceMockRecorder {
	return m.recorder
}

// CreateEntity mocks base method.
func (m *MockCollectionPoolService) CreateEntity(arg0 service.CollectionPoolCreateDTO) (*entity.CollectionPool, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntity", arg0)
	ret0, _ := ret[0].(*entity.CollectionPool)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntity indicates an expected call of CreateEntity.
func (mr *MockCollectionPoolServiceMockRecorder) CreateEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntity", reflect.TypeOf((*MockCollectionPoolService)(nil).CreateEntity), arg0)
}

// DeleteEntity mocks base method.
func (m *MockCollectionPoolService) DeleteEntity(arg0 uint64) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntity", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntity indicates an expected call of DeleteEntity.
func (mr *MockCollectionPoolServiceMockRecorder) DeleteEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntity", reflect.TypeOf((*MockCollectionPoolService)(nil).DeleteEntity), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockCollectionPoolService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockCollectionPoolServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockCollectionPoolService)(nil).GetEntitiesBySQL), arg0)
}

// UpdateEntity mocks base method.
func (m *MockCollectionPoolService) UpdateEntity(arg0 uint64, arg1 service.CollectionPoolUpdateDTO) (*entity.CollectionPool, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateEntity", arg0, arg1)
	ret0, _ := ret[0].(*entity.CollectionPool)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateEntity indicates an expected call of UpdateEntity.
func (mr *MockCollectionPoolServiceMockRecorder) UpdateEntity(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateEntity", reflect.TypeOf((*MockCollectionPoolService)(nil).UpdateEntity), arg0, arg1)
}
