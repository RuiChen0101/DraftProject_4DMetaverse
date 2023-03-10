// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/storage_service/internal/service (interfaces: DirectoryService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/storage_service/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockDirectoryService is a mock of DirectoryService interface.
type MockDirectoryService struct {
	ctrl     *gomock.Controller
	recorder *MockDirectoryServiceMockRecorder
}

// MockDirectoryServiceMockRecorder is the mock recorder for MockDirectoryService.
type MockDirectoryServiceMockRecorder struct {
	mock *MockDirectoryService
}

// NewMockDirectoryService creates a new mock instance.
func NewMockDirectoryService(ctrl *gomock.Controller) *MockDirectoryService {
	mock := &MockDirectoryService{ctrl: ctrl}
	mock.recorder = &MockDirectoryServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockDirectoryService) EXPECT() *MockDirectoryServiceMockRecorder {
	return m.recorder
}

// EnsurePath mocks base method.
func (m *MockDirectoryService) EnsurePath(arg0 string) (uint64, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "EnsurePath", arg0)
	ret0, _ := ret[0].(uint64)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// EnsurePath indicates an expected call of EnsurePath.
func (mr *MockDirectoryServiceMockRecorder) EnsurePath(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "EnsurePath", reflect.TypeOf((*MockDirectoryService)(nil).EnsurePath), arg0)
}

// GetEntitiesByParentId mocks base method.
func (m *MockDirectoryService) GetEntitiesByParentId(arg0 *uint64) ([]entity.Directory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesByParentId", arg0)
	ret0, _ := ret[0].([]entity.Directory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntitiesByParentId indicates an expected call of GetEntitiesByParentId.
func (mr *MockDirectoryServiceMockRecorder) GetEntitiesByParentId(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesByParentId", reflect.TypeOf((*MockDirectoryService)(nil).GetEntitiesByParentId), arg0)
}

// GetEntitiesByPathPrefix mocks base method.
func (m *MockDirectoryService) GetEntitiesByPathPrefix(arg0 string) ([]entity.Directory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesByPathPrefix", arg0)
	ret0, _ := ret[0].([]entity.Directory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntitiesByPathPrefix indicates an expected call of GetEntitiesByPathPrefix.
func (mr *MockDirectoryServiceMockRecorder) GetEntitiesByPathPrefix(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesByPathPrefix", reflect.TypeOf((*MockDirectoryService)(nil).GetEntitiesByPathPrefix), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockDirectoryService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockDirectoryServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockDirectoryService)(nil).GetEntitiesBySQL), arg0)
}

// GetEntity mocks base method.
func (m *MockDirectoryService) GetEntity(arg0 uint64) (*entity.Directory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntity", arg0)
	ret0, _ := ret[0].(*entity.Directory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntity indicates an expected call of GetEntity.
func (mr *MockDirectoryServiceMockRecorder) GetEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntity", reflect.TypeOf((*MockDirectoryService)(nil).GetEntity), arg0)
}

// GetEntityByPath mocks base method.
func (m *MockDirectoryService) GetEntityByPath(arg0 string) (*entity.Directory, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntityByPath", arg0)
	ret0, _ := ret[0].(*entity.Directory)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntityByPath indicates an expected call of GetEntityByPath.
func (mr *MockDirectoryServiceMockRecorder) GetEntityByPath(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntityByPath", reflect.TypeOf((*MockDirectoryService)(nil).GetEntityByPath), arg0)
}
