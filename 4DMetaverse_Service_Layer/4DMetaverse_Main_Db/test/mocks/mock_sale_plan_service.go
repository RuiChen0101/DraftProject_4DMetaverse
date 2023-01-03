// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/service (interfaces: SalePlanService)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	service "4dmetaverse/main_db/internal/service"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockSalePlanService is a mock of SalePlanService interface.
type MockSalePlanService struct {
	ctrl     *gomock.Controller
	recorder *MockSalePlanServiceMockRecorder
}

// MockSalePlanServiceMockRecorder is the mock recorder for MockSalePlanService.
type MockSalePlanServiceMockRecorder struct {
	mock *MockSalePlanService
}

// NewMockSalePlanService creates a new mock instance.
func NewMockSalePlanService(ctrl *gomock.Controller) *MockSalePlanService {
	mock := &MockSalePlanService{ctrl: ctrl}
	mock.recorder = &MockSalePlanServiceMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockSalePlanService) EXPECT() *MockSalePlanServiceMockRecorder {
	return m.recorder
}

// CreateEntity mocks base method.
func (m *MockSalePlanService) CreateEntity(arg0 service.SalePlanCreateDTO) (*entity.SalePlan, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CreateEntity", arg0)
	ret0, _ := ret[0].(*entity.SalePlan)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// CreateEntity indicates an expected call of CreateEntity.
func (mr *MockSalePlanServiceMockRecorder) CreateEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CreateEntity", reflect.TypeOf((*MockSalePlanService)(nil).CreateEntity), arg0)
}

// DeleteEntity mocks base method.
func (m *MockSalePlanService) DeleteEntity(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "DeleteEntity", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// DeleteEntity indicates an expected call of DeleteEntity.
func (mr *MockSalePlanServiceMockRecorder) DeleteEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "DeleteEntity", reflect.TypeOf((*MockSalePlanService)(nil).DeleteEntity), arg0)
}

// GetDefaultSalePlan mocks base method.
func (m *MockSalePlanService) GetDefaultSalePlan(arg0 uuid.UUID) (*entity.SalePlan, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetDefaultSalePlan", arg0)
	ret0, _ := ret[0].(*entity.SalePlan)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetDefaultSalePlan indicates an expected call of GetDefaultSalePlan.
func (mr *MockSalePlanServiceMockRecorder) GetDefaultSalePlan(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetDefaultSalePlan", reflect.TypeOf((*MockSalePlanService)(nil).GetDefaultSalePlan), arg0)
}

// GetEntitiesBySQL mocks base method.
func (m *MockSalePlanService) GetEntitiesBySQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntitiesBySQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// GetEntitiesBySQL indicates an expected call of GetEntitiesBySQL.
func (mr *MockSalePlanServiceMockRecorder) GetEntitiesBySQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntitiesBySQL", reflect.TypeOf((*MockSalePlanService)(nil).GetEntitiesBySQL), arg0)
}

// GetEntity mocks base method.
func (m *MockSalePlanService) GetEntity(arg0 uuid.UUID) (*entity.SalePlan, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "GetEntity", arg0)
	ret0, _ := ret[0].(*entity.SalePlan)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// GetEntity indicates an expected call of GetEntity.
func (mr *MockSalePlanServiceMockRecorder) GetEntity(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "GetEntity", reflect.TypeOf((*MockSalePlanService)(nil).GetEntity), arg0)
}

// SetCollections mocks base method.
func (m *MockSalePlanService) SetCollections(arg0 uuid.UUID, arg1 service.SalePlanSetCollectionsDTO) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SetCollections", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// SetCollections indicates an expected call of SetCollections.
func (mr *MockSalePlanServiceMockRecorder) SetCollections(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SetCollections", reflect.TypeOf((*MockSalePlanService)(nil).SetCollections), arg0, arg1)
}

// SwitchDefault mocks base method.
func (m *MockSalePlanService) SwitchDefault(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "SwitchDefault", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// SwitchDefault indicates an expected call of SwitchDefault.
func (mr *MockSalePlanServiceMockRecorder) SwitchDefault(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "SwitchDefault", reflect.TypeOf((*MockSalePlanService)(nil).SwitchDefault), arg0)
}

// UpdateEntity mocks base method.
func (m *MockSalePlanService) UpdateEntity(arg0 uuid.UUID, arg1 service.SalePlanUpdateDTO) (*entity.SalePlan, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateEntity", arg0, arg1)
	ret0, _ := ret[0].(*entity.SalePlan)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// UpdateEntity indicates an expected call of UpdateEntity.
func (mr *MockSalePlanServiceMockRecorder) UpdateEntity(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateEntity", reflect.TypeOf((*MockSalePlanService)(nil).UpdateEntity), arg0, arg1)
}
