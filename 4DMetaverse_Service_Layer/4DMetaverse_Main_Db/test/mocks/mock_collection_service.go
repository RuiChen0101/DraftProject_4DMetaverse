// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/service (interfaces: CollectionService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	service "4dmetaverse/main_db/internal/service"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockCollectionService is a mock of CollectionService interface.
type MockCollectionService struct {
	ctrl     *gomock.Controller
	recorder *MockCollectionServiceMockRecorder
}

// MockCollectionServiceMockRecorder is the mock recorder for MockCollectionService.
type MockCollectionServiceMockRecorder struct {
	mock *MockCollectionService
}

// NewMockCollectionService creates a new mock instance.
func NewMockCollectionService(ctrl *gomock.Controller) *MockCollectionService {
	mock := &MockCollectionService{ctrl: ctrl}
	mock.recorder = &MockCollectionServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockCollectionService) EXPECT() *MockCollectionServiceMockRecorder {
	return m.recorder
}

// CreateEntity mocks base method.
func (m *MockCollectionService) CreateEntity(arg0 service.CollectionCreateDTO) (*entity.Collection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntity", arg0)
	ret0, _ := ret[0].(*entity.Collection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntity indicates an expected call of CreateEntity.
func (mr *MockCollectionServiceMockRecorder) CreateEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntity", reflect.TypeOf((*MockCollectionService)(nil).CreateEntity), arg0)
}

// DeleteEntity mocks base method.
func (m *MockCollectionService) DeleteEntity(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntity", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntity indicates an expected call of DeleteEntity.
func (mr *MockCollectionServiceMockRecorder) DeleteEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntity", reflect.TypeOf((*MockCollectionService)(nil).DeleteEntity), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockCollectionService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockCollectionServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockCollectionService)(nil).GetEntitiesBySQL), arg0)
}

// GetEntity mocks base method.
func (m *MockCollectionService) GetEntity(arg0 uuid.UUID) (*entity.Collection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntity", arg0)
	ret0, _ := ret[0].(*entity.Collection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntity indicates an expected call of GetEntity.
func (mr *MockCollectionServiceMockRecorder) GetEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntity", reflect.TypeOf((*MockCollectionService)(nil).GetEntity), arg0)
}

// GetPreviewsBySalePlanId mocks base method.
func (m *MockCollectionService) GetPreviewsBySalePlanId(arg0 uuid.UUID) ([]entity.PreviewCollection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetPreviewsBySalePlanId", arg0)
	ret0, _ := ret[0].([]entity.PreviewCollection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetPreviewsBySalePlanId indicates an expected call of GetPreviewsBySalePlanId.
func (mr *MockCollectionServiceMockRecorder) GetPreviewsBySalePlanId(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetPreviewsBySalePlanId", reflect.TypeOf((*MockCollectionService)(nil).GetPreviewsBySalePlanId), arg0)
}

// UpdateEntity mocks base method.
func (m *MockCollectionService) UpdateEntity(arg0 uuid.UUID, arg1 service.CollectionUpdateDTO) (*entity.Collection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateEntity", arg0, arg1)
	ret0, _ := ret[0].(*entity.Collection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateEntity indicates an expected call of UpdateEntity.
func (mr *MockCollectionServiceMockRecorder) UpdateEntity(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateEntity", reflect.TypeOf((*MockCollectionService)(nil).UpdateEntity), arg0, arg1)
}
