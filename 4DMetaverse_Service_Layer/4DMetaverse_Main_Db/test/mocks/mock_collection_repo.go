// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/repository (interfaces: CollectionRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
	uuid "github.com/google/uuid"
)

// MockCollectionRepo is a mock of CollectionRepo interface.
type MockCollectionRepo struct {
	ctrl     *gomock.Controller
	recorder *MockCollectionRepoMockRecorder
}

// MockCollectionRepoMockRecorder is the mock recorder for MockCollectionRepo.
type MockCollectionRepoMockRecorder struct {
	mock *MockCollectionRepo
}

// NewMockCollectionRepo creates a new mock instance.
func NewMockCollectionRepo(ctrl *gomock.Controller) *MockCollectionRepo {
	mock := &MockCollectionRepo{ctrl: ctrl}
	mock.recorder = &MockCollectionRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockCollectionRepo) EXPECT() *MockCollectionRepoMockRecorder {
	return m.recorder
}

// CountUnlocked mocks base method.
func (m *MockCollectionRepo) CountUnlocked(arg0 uuid.UUID) int64 {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "CountUnlocked", arg0)
	ret0, _ := ret[0].(int64)
	return ret0
}

// CountUnlocked indicates an expected call of CountUnlocked.
func (mr *MockCollectionRepoMockRecorder) CountUnlocked(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "CountUnlocked", reflect.TypeOf((*MockCollectionRepo)(nil).CountUnlocked), arg0)
}

// Create mocks base method.
func (m *MockCollectionRepo) Create(arg0 *entity.Collection) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockCollectionRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockCollectionRepo)(nil).Create), arg0)
}

// Delete mocks base method.
func (m *MockCollectionRepo) Delete(arg0 uuid.UUID) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Delete", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Delete indicates an expected call of Delete.
func (mr *MockCollectionRepoMockRecorder) Delete(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Delete", reflect.TypeOf((*MockCollectionRepo)(nil).Delete), arg0)
}

// FindById mocks base method.
func (m *MockCollectionRepo) FindById(arg0 uuid.UUID) (*entity.Collection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindById", arg0)
	ret0, _ := ret[0].(*entity.Collection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindById indicates an expected call of FindById.
func (mr *MockCollectionRepoMockRecorder) FindById(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindById", reflect.TypeOf((*MockCollectionRepo)(nil).FindById), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockCollectionRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockCollectionRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockCollectionRepo)(nil).FindByNativeSQL), arg0)
}

// ListBySalePlanId mocks base method.
func (m *MockCollectionRepo) ListBySalePlanId(arg0 uuid.UUID) ([]entity.Collection, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "ListBySalePlanId", arg0)
	ret0, _ := ret[0].([]entity.Collection)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// ListBySalePlanId indicates an expected call of ListBySalePlanId.
func (mr *MockCollectionRepoMockRecorder) ListBySalePlanId(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "ListBySalePlanId", reflect.TypeOf((*MockCollectionRepo)(nil).ListBySalePlanId), arg0)
}

// Update mocks base method.
func (m *MockCollectionRepo) Update(arg0 uuid.UUID, arg1 *entity.Collection) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Update", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// Update indicates an expected call of Update.
func (mr *MockCollectionRepoMockRecorder) Update(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Update", reflect.TypeOf((*MockCollectionRepo)(nil).Update), arg0, arg1)
}
